import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatDollars } from "../MetaMisc/types";
import { TAX_ROW_CONFIG, PURPOSE_ROW_CONFIG } from "./ResultsBlock";

type TaxKey = (typeof TAX_ROW_CONFIG)[number]["key"];

type UserInputs = {
  address: string;
  annualIncome: number;
  filingStatus: string;
  homeValue: number;
  carYear: number;
  carMake: string;
  carModel: string;
  carMiles: number;
};

type ReceiptPDFProps = {
  userInputs: UserInputs;
  taxAmounts: Record<TaxKey, number>;
  totalTax: number;
  purposeAmounts: Record<string, number>;
  sankeyImageUrl: string;
  utahSealUrl: string;
};

const DARK_GREEN = "#17301b";
const ROW_SHADE = "#d4e0d6";
const BORDER = "#9ca3af";

const s = StyleSheet.create({
  page: {
    padding: 24,
    color: DARK_GREEN,
    fontFamily: "Helvetica",
    fontSize: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  address: {
    fontSize: 9,
    textAlign: "center",
    marginRight: 16,
  },
  seal: { width: 56, height: 56 },
  sectionTitle: {
    fontFamily: "Helvetica-BoldOblique",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  table: { marginBottom: 16 },
  row: {
    flexDirection: "row",
    height: 24,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  shaded: { backgroundColor: ROW_SHADE },
  label: { flex: 6, paddingVertical: 2, paddingHorizontal: 4 },
  spacer: { flex: 1 },
  value: {
    flex: 3,
    textAlign: "right",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  columns: { flexDirection: "row", gap: 8, flexGrow: 1 },
  colTax: { flex: 1, alignSelf: "stretch", justifyContent: "center" },
  colSankey: { flex: 4, justifyContent: "center" },
  colPurpose: { flex: 1, alignSelf: "stretch", justifyContent: "center" },
  sankey: { width: "100%" },
  disclaimer: { marginTop: 8, fontSize: 7, color: "#6b7280" },
  inputsSection: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  inputCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRightWidth: 0.5,
    borderRightColor: BORDER,
  },
  inputCellLast: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  inputLabel: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 1,
  },
  inputValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
});

export function ReceiptPDF({
  userInputs,
  taxAmounts,
  totalTax,
  purposeAmounts,
  sankeyImageUrl,
  utahSealUrl,
}: ReceiptPDFProps) {
  const {
    annualIncome,
    filingStatus,
    address,
    homeValue,
    carYear,
    carMake,
    carModel,
    carMiles,
  } = userInputs;

  const totalPurpose = PURPOSE_ROW_CONFIG.reduce(
    (sum, { key }) => sum + (purposeAmounts[key] ?? 0),
    0,
  );
  const effectiveRate =
    annualIncome === 0
      ? "0%"
      : `${((100 * totalTax) / annualIncome).toFixed(2)}%`;

  const vehicleLabel =
    carYear && carMake && carModel
      ? `${carYear} ${carMake} ${carModel}`
      : carYear && carMake
        ? `${carYear} ${carMake}`
        : "";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.header}>
          <Text style={s.address}>
            {"Utah State Capitol\n350 State Street\nSalt Lake City, UT 84103"}
          </Text>
          <Image style={s.seal} src={utahSealUrl} />
        </View>

        <View style={s.inputsSection}>
          {!!address && (
            <View style={s.inputCell}>
              <Text style={s.inputLabel}>City or County</Text>
              <Text style={s.inputValue}>{address}</Text>
            </View>
          )}
          {!!annualIncome && (
            <View style={s.inputCell}>
              <Text style={s.inputLabel}>Annual Income</Text>
              <Text style={s.inputValue}>{formatDollars(annualIncome)}</Text>
            </View>
          )}
          {!!filingStatus && (
            <View style={s.inputCell}>
              <Text style={s.inputLabel}>Filing Status</Text>
              <Text style={s.inputValue}>{filingStatus}</Text>
            </View>
          )}
          {!!homeValue && (
            <View style={s.inputCell}>
              <Text style={s.inputLabel}>Home Value</Text>
              <Text style={s.inputValue}>{formatDollars(homeValue)}</Text>
            </View>
          )}
          {!!vehicleLabel && (
            <View style={s.inputCell}>
              <Text style={s.inputLabel}>Vehicle</Text>
              <Text style={s.inputValue}>{vehicleLabel}</Text>
            </View>
          )}
          {!!carMiles && (
            <View style={s.inputCellLast}>
              <Text style={s.inputLabel}>Annual Miles</Text>
              <Text style={s.inputValue}>{carMiles.toLocaleString()}</Text>
            </View>
          )}
        </View>

        <View style={s.columns}>
          <View style={s.colTax}>
            <Text style={s.sectionTitle}>Your Estimated Taxes Paid</Text>
            {TAX_ROW_CONFIG.map(({ label, key }, i) => (
              <View key={key} style={[s.row, i % 2 === 1 ? s.shaded : {}]}>
                <Text style={s.label}>{label}</Text>
                <Text style={s.spacer} />
                <Text style={s.value}>{formatDollars(taxAmounts[key])}</Text>
              </View>
            ))}
            <View style={[s.row, s.shaded]}>
              <Text style={[s.label, s.bold]}>Total</Text>
              <Text style={s.spacer} />
              <Text style={[s.value, s.bold]}>{formatDollars(totalTax)}</Text>
            </View>
            <View style={s.row}>
              <Text style={[s.label, s.bold]}>Effective Tax Rate</Text>
              <Text style={s.spacer} />
              <Text style={[s.value, s.bold]}>{effectiveRate}</Text>
            </View>
          </View>

          <View style={s.colSankey}>
            {sankeyImageUrl && <Image style={s.sankey} src={sankeyImageUrl} />}
          </View>

          <View style={s.colPurpose}>
            <Text style={s.sectionTitle}>Your Estimated Public Purchases</Text>
            {PURPOSE_ROW_CONFIG.map(({ label, key, link }, i) => (
              <View key={key} style={[s.row, i % 2 === 1 ? s.shaded : {}]}>
                <Link
                  style={[
                    s.label,
                    { color: DARK_GREEN, textDecoration: "none" },
                  ]}
                  src={link}
                >
                  {label}
                </Link>
                <Text style={s.spacer} />
                <Text style={s.value}>
                  {formatDollars(purposeAmounts[key] ?? 0)}
                </Text>
              </View>
            ))}
            <View style={s.row}>
              <Text style={[s.label, s.bold]}>Total</Text>
              <Text style={s.spacer} />
              <Text style={[s.value, s.bold]}>
                {formatDollars(totalPurpose)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={s.disclaimer}>
          The above results are for illustration purposes only. Estimates
          represent the typical circumstances for similarly situated taxpayers.
          This is not a tax notice, bill, or other official record.
        </Text>
      </Page>
    </Document>
  );
}
