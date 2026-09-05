# P.R.A.M.A.A.N — BIS Indian Standards Technical Reference Corpus (v1)
**Purpose:** Source-grounded RAG ingestion document covering the Top 50 Indian Standards across 10 product categories.
**Methodology note (read before ingesting):** Every fact below is either (a) drawn from a cited public source — BIS circulars, PIB releases, gazette QCOs, or verified secondary technical references — or (b) explicitly marked `[Verify against official IS document]` where the exact clause number or numeric limit sits behind BIS's paid standard document and could not be confirmed from public sources. **Do not let the LLM "fill in" the flagged fields during embedding or generation — treat the flag itself as retrievable content**, so the assistant tells the user "this exact figure needs verification from the official IS document" instead of guessing.

---

## 1. FOOD & BEVERAGES

### IS 10500 : 2012 — Drinking Water Specification (Second Revision)
- **Category**: Food & Beverages / Public Health
- **Scope & Applicability**: Specifies acceptable and permissible limits for physical, chemical, bacteriological, and radiological parameters of drinking water — used for packaged water plants, piped municipal supply (JJM/AMRUT schemes), borewells, and building-level domestic supply testing.
- **Mandatory Scheme / QCO Status**: Certification via BIS **Scheme III (HACCP, IS 15000:2013) + Scheme IV (IS 10500:2012)** integrated scheme for water treatment/distribution plants. Note: as of a regulatory shift, FSSAI's **compulsory testing scheme for Packaged Drinking Water/Mineral Water took effect 1 January 2026**, replacing the earlier mandatory-BIS-license precondition under FSS (Prohibition and Restriction on Sales) Regulations 2011 (withdrawn via notification dated 17 Oct 2024). Governing bodies: BIS + FSSAI (Ministry of Health & Family Welfare / DoCA).
- **Key Technical Parameters & Permissible Limits** (Acceptable / Permissible where two values exist):

| Parameter | Acceptable Limit | Permissible Limit | Clause |
|---|---|---|---|
| pH | 6.5–8.5 | No relaxation | Table 2 |
| Turbidity (NTU) | 1 | 5 | Table 2 |
| Total Dissolved Solids (mg/l) | 500 | 2000 | Table 2 |
| Total Hardness as CaCO₃ (mg/l) | 200 | 600 | Table 2 |
| Chloride (mg/l) | 250 | 1000 | Table 2 |
| Fluoride (mg/l) | 1.0 | 1.5 | Table 2 |
| Nitrate (mg/l) | 45 | No relaxation | Table 2 |
| Iron (mg/l) | 0.3 | No relaxation | Table 2 |
| Arsenic (mg/l) | 0.01 | 0.05 | Table 2 |
| Total Coliform / E. coli | Not detectable in 100 ml (mandatory) | — | Table 4 |
| Residual free chlorine (when chlorinated) | ≥ 0.2 mg/l at consumer end | — | Cl. 4 |

- **Testing & Laboratory Protocols**: Batch-wise testing at BIS-recognized labs is mandatory for packaged water (every production batch); municipal/piped supply undergoes periodic testing by civic bodies. Testing fee at BIS-recognized private labs ≈ ₹7,000 per full-parameter scope (source: BIS LIMS lab listing).
- **Certification & Fee Guidance**: MSME concessions apply per current BIS fee-concession framework (see Section 12 below) — 80% for micro/startups, 50% for small enterprises, 20% for medium enterprises (effective through the extended concession window). [Exact per-litre marking fee: Verify against official BIS Scheme-I fee notification.]

---

### IS 13428 : 2005 — Packaged Natural Mineral Water Specification (Second Revision)
- **Category**: Food & Beverages
- **Scope & Applicability**: Covers natural mineral water extracted from protected underground sources, bottled without altering its mineral composition (distinct from IS 14543 processed packaged water).
- **Mandatory Scheme / QCO Status**: Mandatory BIS certification for sale under FSS Regulations; governed jointly by BIS and FSSAI (Ministry of Health & Family Welfare).
- **Key Technical Parameters & Permissible Limits**: Testing charge at BIS-recognized labs ≈ ₹7,000 (BIS LIMS). [Specific mineral content bands (e.g., max arsenic, nitrate for natural mineral water differ slightly from IS 10500): Verify against official IS document.]
- **Testing & Laboratory Protocols**: Source protection certification, microbiological + physicochemical batch testing at BIS-recognized/BIS labs required before licensing.
- **Certification & Fee Guidance**: Same MSME concession structure as above; license renewal requires periodic surveillance sampling.

### IS 14543 : 2016 — Packaged Drinking Water (Other Than Natural Mineral Water) Specification (Second Revision)
- **Category**: Food & Beverages
- **Scope & Applicability**: Covers processed/purified packaged drinking water (RO, UV, ozonation treated) sold in bottles/pouches/jars — the standard governing most commercial "packaged drinking water" brands.
- **Mandatory Scheme / QCO Status**: BIS ISI-mark certification historically required as precondition for FSSAI license; superseded from 1 Jan 2026 by FSSAI's compulsory testing scheme under Regulation 2.2.8 FSSR (see IS 10500 entry above for the regulatory transition).
- **Key Technical Parameters & Permissible Limits**: Testing charge ≈ ₹7,000 at BIS-recognized labs (BIS LIMS listing). [Exact numeric limits table: Verify against official IS document — largely mirrors IS 10500 acceptable-limit column.]
- **Testing & Laboratory Protocols**: Every production batch tested; ISI mark + batch code + BIS license number mandatory on label.
- **Certification & Fee Guidance**: 80%/50%/20% micro/small/medium concessions apply.

### IS 14433 — Infant Milk Food / Infant Formula
- **Category**: Food & Beverages
- **Scope & Applicability**: Covers infant milk food and infant formula composition, nutritional adequacy, and safety for children under specified age brackets.
- **Mandatory Scheme / QCO Status**: Regulated jointly under FSSAI Food Safety and Standards (Food Products Standards and Food Additives) Regulations and BIS voluntary/mandatory certification depending on product category; governing ministry: Ministry of Health & Family Welfare / FSSAI, with BIS providing the technical specification.
- **Key Technical Parameters & Permissible Limits**: [Nutritional composition tables (protein, fat, vitamin/mineral fortification bands): Verify against official IS document and current FSSAI regulation, as infant nutrition standards are revised periodically for safety reasons.]
- **Testing & Laboratory Protocols**: Requires accredited food-testing lab analysis for microbiological safety, contaminant limits (melamine, heavy metals), and nutrient claims verification.
- **Certification & Fee Guidance**: [Verify current licensing route — FSSAI license vs BIS product certification — against latest notification, as this area is closely regulated and subject to periodic change.]

### IS 17853 — Fortified Rice
- **Category**: Food & Beverages / Public Distribution
- **Scope & Applicability**: Specification for rice fortified with micronutrients (iron, folic acid, vitamin B12) distributed via PDS, ICDS, and PM POSHAN schemes — a Government of India nutrition-security initiative.
- **Mandatory Scheme / QCO Status**: Mandated for supply under the Public Distribution System nationally from FY 2024 onward per Ministry of Consumer Affairs, Food & Public Distribution directives; FSSAI-regulated blending ratio and Fortified Rice Kernel (FRK) specification.
- **Key Technical Parameters & Permissible Limits**: [FRK blending ratio (typically ~1:100 FRK to rice) and micronutrient fortification levels: Verify against current FSSAI/IS 17853 notification, as exact figures are updated by government order.]
- **Testing & Laboratory Protocols**: FRK manufacturers require BIS/FSSAI certification; blending mills undergo periodic sampling for micronutrient retention.
- **Certification & Fee Guidance**: [Verify against latest DoCA/DFPD circular for FRK manufacturer licensing fee structure.]

### IS 542 — Mustard Oil
- **Category**: Food & Beverages
- **Scope & Applicability**: Specification for edible mustard oil quality — purity, extraction method, and adulteration prevention (notably banning mustard oil blending with other oils, a long-standing FSSAI/BIS public-health measure).
- **Mandatory Scheme / QCO Status**: Regulated under FSSAI edible oil standards; BIS IS 542 provides the technical specification referenced in FSSAI regulations. 100% pure mustard oil mandate (no blending) enforced by FSSAI since 2020.
- **Key Technical Parameters & Permissible Limits**: [Erucic acid content, free fatty acid %, iodine value, and allyl isothiocyanate content bands: Verify against official IS document — these are safety-relevant figures and should not be approximated.]
- **Testing & Laboratory Protocols**: Gas chromatography for fatty-acid profiling; adulterant (argemone oil) detection test is a mandatory safety check given known public-health incidents historically linked to adulterated mustard oil.
- **Certification & Fee Guidance**: FSSAI license mandatory for all edible-oil packers; BIS certification largely voluntary but referenced for export/institutional buyers.

---

## 2. ELECTRONICS & INFORMATION TECHNOLOGY (CRS Scheme)

**Category-wide note**: The Compulsory Registration Scheme (CRS) was introduced in **2012 by the Ministry of Electronics & Information Technology (MeitY)** via the "Electronics and Information Technology Goods (Requirement for Compulsory Registration) Order, 2012," administered by BIS. Registered products carry the **BIS Standard Mark + a unique R-number**. Registration (not full licensing) is done via BIS's **"Smart Registration"** portal (launched 3 April 2019) — paperless and web-enabled. Import, sale, or distribution of listed products without CRS registration is prohibited.

### IS 16102 (Part 1 & 2) — Self-Ballasted LED Lamps
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: LED lamps with integrated ballast/driver for general lighting service, aligned with IEC 62560.
- **Mandatory Scheme / QCO Status**: Mandatory CRS registration under MeitY order; governing dept: MeitY + BIS.
- **Key Technical Parameters & Permissible Limits**: [Luminous efficacy (lm/W), lamp cap fit, thermal/electrical safety limits: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Tested at BIS-recognized labs (e.g., Nemko-affiliated labs) for photometric, thermal, and electrical-safety compliance per IEC 62560 harmonization.
- **Certification & Fee Guidance**: CRS registration fee structure separate from ISI marking fee; MSME concessions apply per current BIS notification.

### IS 16333 — Mobile Phone Handsets & Smart Phones
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: Mobile handsets and smartphones sold in India; **IS 16333 (Part 3)** specifically governs regional-language support requirements on handsets.
- **Mandatory Scheme / QCO Status**: Mandatory CRS registration; governing dept: MeitY + BIS.
- **Key Technical Parameters & Permissible Limits**: [SAR (Specific Absorption Rate) limits, battery safety cross-reference to IS 16046, language-support test criteria: Verify against official IS document — SAR limits are separately governed by DoT regulations and should be cross-checked there too.]
- **Testing & Laboratory Protocols**: BIS-recognized lab testing for electrical safety, EMI/EMC, and mandated Indian-language support.
- **Certification & Fee Guidance**: CRS registration renewable; concessions per MSME category.

### IS 16046 (Part 1 & 2) — Secondary Cells / Lithium-Ion Batteries
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: **Part 1** covers nickel-system cells/batteries; **Part 2** covers lithium-system cells/batteries used in consumer electronics, e-bikes/EVs, and power banks.
- **Mandatory Scheme / QCO Status**: Mandatory CRS registration; critical for fire-safety given multiple EV/e-scooter battery fire incidents that drove tightened enforcement in recent years.
- **Key Technical Parameters & Permissible Limits**: [Thermal runaway thresholds, short-circuit/overcharge protection test criteria: Verify against official IS document — these are safety-critical figures.]
- **Testing & Laboratory Protocols**: Mandatory abuse testing (crush, overcharge, short-circuit, thermal cycling) at BIS-recognized labs.
- **Certification & Fee Guidance**: CRS registration; MSME concessions apply.

### IS 13252 (Part 1) — Information Technology Equipment (incl. Power Adapters)
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: IT equipment including laptops, power adapters/chargers, aligned with IEC 60950-1/62368-1.
- **Mandatory Scheme / QCO Status**: Mandatory CRS registration; governing dept: MeitY + BIS.
- **Key Technical Parameters & Permissible Limits**: [Insulation, creepage/clearance distances, thermal limits: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Electrical safety, EMC testing at BIS-recognized labs.
- **Certification & Fee Guidance**: CRS registration; MSME concessions apply.

### IS 13252 — Smart Watches & Wearable Devices
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: Wearable electronic devices under the broader IT equipment safety framework.
- **Mandatory Scheme / QCO Status**: CRS registration mandatory (wearables were added to the CRS product list in later phases post-2012).
- **Key Technical Parameters & Permissible Limits**: [Verify against official IS document and current CRS product list — wearables classification has evolved; confirm current applicable IS number for smartwatches specifically, as it is often tested under IS 13252 general IT-equipment provisions rather than a dedicated wearables standard.]
- **Testing & Laboratory Protocols**: Electrical/battery safety testing per IS 16046 cross-reference for embedded batteries.
- **Certification & Fee Guidance**: CRS registration; MSME concessions apply.

### IS 616 — Audio, Video and Similar Electronic Apparatus (Smart TVs)
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: Audio/video equipment including Smart TVs, aligned with IEC 60065.
- **Mandatory Scheme / QCO Status**: Mandatory CRS registration (IS 616:2017/IEC 60065); governing dept: MeitY + BIS.
- **Key Technical Parameters & Permissible Limits**: [Electrical safety clearances, fire-hazard test criteria: Verify against official IS document.]
- **Testing & Laboratory Protocols**: BIS-recognized lab testing for electrical and fire safety.
- **Certification & Fee Guidance**: CRS registration; MSME concessions apply.

### IS 16242 — Uninterruptible Power Supply (UPS / Inverters)
- **Category**: Electronics & IT (CRS)
- **Scope & Applicability**: UPS systems and household inverters.
- **Mandatory Scheme / QCO Status**: [Verify current CRS/QCO applicability status against the latest BIS CRS product list — coverage of UPS/inverters under CRS has been introduced in later notification phases; confirm effective date before citing as currently mandatory.]
- **Key Technical Parameters & Permissible Limits**: [Verify against official IS document.]
- **Testing & Laboratory Protocols**: Electrical safety and load-testing at BIS-recognized labs.
- **Certification & Fee Guidance**: MSME concessions apply where CRS/ISI registration is confirmed mandatory.

---

## 3. ELECTRICAL & HOUSEHOLD APPLIANCES (ISI Mark — Scheme I)

**Category-wide note**: These items fall under BIS's core **ISI Mark (Scheme-I) product-certification** licensing route (distinct from CRS registration) — requiring a factory audit, in-house/BIS-recognized lab testing, and ongoing surveillance, governed under the **BIS (Conformity Assessment) Regulations, 2018**.

### IS 374 — Electric Ceiling Fans
- **Category**: Electrical Appliances (ISI)
- **Scope & Applicability**: Domestic and industrial electric ceiling fans.
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark under relevant QCO for electrical appliances.
- **Key Technical Parameters & Permissible Limits**: [Air delivery (CMM), power consumption (W), service value, insulation resistance: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Endurance run, air-delivery test, electrical safety (earthing, insulation) tests at BIS-recognized labs.
- **Certification & Fee Guidance**: ISI license; MSME concessions (80/50/20%) apply.

### IS 366 — Electric Dry / Steam Irons
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark.
- **Scope & Applicability**: Household electric dry and steam pressing irons.
- **Key Technical Parameters & Permissible Limits**: [Verify against official IS document — thermostat cut-off temperature, insulation and earthing continuity limits.]
- **Testing & Laboratory Protocols**: Thermal cycling, insulation resistance, leakage current tests.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 2082 — Electric Storage Water Heaters (Geysers)
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark (fire/electrical-safety-critical appliance category, tightly enforced given past incidents).
- **Scope & Applicability**: Domestic storage-type electric water heaters.
- **Key Technical Parameters & Permissible Limits**: [Pressure-relief valve rating, thermostat safety cut-off, tank hydrostatic test pressure: Verify against official IS document — safety-critical, do not approximate.]
- **Testing & Laboratory Protocols**: Hydrostatic pressure test, thermal cut-off verification, earth-continuity test.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 15750 — Household Frost-Free Refrigerators
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark; cross-referenced with BEE star-labelling (energy efficiency) which is a separate, additional mandatory scheme administered by Bureau of Energy Efficiency.
- **Scope & Applicability**: Household frost-free refrigerators.
- **Key Technical Parameters & Permissible Limits**: [Energy consumption band, refrigerant safety, door-seal/insulation performance: Verify against official IS document and current BEE star-rating schedule separately.]
- **Testing & Laboratory Protocols**: Energy consumption test, temperature-pull-down test, safety tests.
- **Certification & Fee Guidance**: ISI license + separate BEE registration; MSME concessions apply to BIS fees.

### IS 1391 — Room Air Conditioners
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark + mandatory BEE star-labelling.
- **Scope & Applicability**: Split and window room air conditioners.
- **Key Technical Parameters & Permissible Limits**: [ISEER (energy efficiency ratio) bands, refrigerant type restrictions: Verify against official IS document and current BEE schedule, as ISEER slabs are revised periodically.]
- **Testing & Laboratory Protocols**: Cooling capacity, energy efficiency, and electrical safety testing.
- **Certification & Fee Guidance**: ISI license + BEE registration; MSME concessions apply to BIS fees.

### IS 694 — PVC Insulated Electric Cables & Wires
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark (a foundational electrical-safety standard given fire-hazard risk of substandard wiring).
- **Scope & Applicability**: PVC-insulated cables/wires for voltages up to and including 1100V.
- **Key Technical Parameters & Permissible Limits**: [Conductor resistance, insulation thickness tolerance, flame-retardant test criteria: Verify against official IS document — safety-critical.]
- **Testing & Laboratory Protocols**: Insulation resistance, conductor resistance, flammability tests at BIS-recognized labs.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 3854 — Switches for Domestic & Similar Fixed Electrical Installations
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark.
- **Scope & Applicability**: Domestic switches (wall switches etc.) rated up to specified voltage/current.
- **Key Technical Parameters & Permissible Limits**: [Rated current/voltage, endurance cycle count, temperature rise limits: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Endurance (mechanical/electrical cycling), temperature-rise, and insulation tests.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 1293 — Plugs and Socket-Outlets up to 16 Amperes
- **Category**: Electrical Appliances (ISI)
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark.
- **Scope & Applicability**: Domestic plugs/sockets rated up to 16A.
- **Key Technical Parameters & Permissible Limits**: [Contact resistance, pin dimensions/tolerances, temperature rise: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Insertion/withdrawal force, temperature-rise, insulation tests.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

---

## 4. JEWELLERY, GOLD & PRECIOUS METALS (Hallmarking)

### IS 1417 : 2016 — Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking
- **Category**: Jewellery / Precious Metals
- **Scope & Applicability**: Governs purity grading and marking of gold jewellery and artefacts sold in India.
- **Mandatory Scheme / QCO Status**: **Mandatory hallmarking** for gold jewellery has been in force since **1 April 2023** nationwide, under Hallmarking Scheme HMS/RAHC/GO1, governed by BIS under DoCA. Jewellers must be BIS-registered to sell hallmarked jewellery.
- **Key Technical Parameters & Permissible Limits**: IS 1417:2016 permits **seven caratages**: 9K (375), 14K (585), 18K (750), 20K (833), 22K (916), 23K (958), and 24K (995 — marked "24KS"). **9K gold was added to the mandatory hallmarking framework from 1 July 2025**, giving consumers a more affordable hallmarked option.

| Caratage | Fineness (parts per 1000) | Marking |
|---|---|---|
| 24K | 995 | 24KS995 |
| 23K | 958 | 23K958 |
| 22K | 916 | 22K916 |
| 20K | 833 | 20K833 |
| 18K | 750 | 18K750 |
| 14K | 585 | 14K585 |
| 9K | 375 | 9K375 |

- **Testing & Laboratory Protocols**: Testing done at BIS-recognized **Assaying & Hallmarking (A&H) Centres** operating per IS 15820:2009. Since 1 July 2021, hallmarked jewellery carries **three marks**: (1) BIS logo, (2) purity/fineness grade, (3) a unique **6-digit alphanumeric HUID** code — replacing the earlier 4-mark system (which also included assay-centre and jeweller ID marks separately). Consumers can verify authenticity via the **"Verify HUID"** feature in the BIS CARE mobile app.
- **Certification & Fee Guidance**: Hallmarking charge is **₹45 per piece**, irrespective of jewellery weight. Jeweller registration with BIS is mandatory and separate from the per-piece hallmarking charge; MSME concessions apply to jeweller registration fees per standard BIS fee-concession structure.

### IS 2112 — Silver and Silver Alloys, Jewellery/Artefacts — Fineness and Marking
- **Category**: Jewellery / Precious Metals
- **Scope & Applicability**: Governs purity grading and marking of silver jewellery/artefacts.
- **Mandatory Scheme / QCO Status**: HUID-based silver hallmarking became **voluntary from 1 September 2025** under revised standard **IS 2112:2025**; government is reviewing whether to make it mandatory. (Silver hallmarking under the earlier IS 2112:2014 existed since December 2005 but on a lower-adoption voluntary basis.)
- **Key Technical Parameters & Permissible Limits**: IS 2112 permits **six grades** (fineness in parts per 1000): 800, 835, 900, 925, 970, and 990.
- **Testing & Laboratory Protocols**: Assaying at BIS-recognized A&H centres per IS 2113:2014 (silver assaying method); hallmarked silver carries the BIS logo + "SILVER" text + purity grade (e.g. 925) + 6-digit HUID.
- **Certification & Fee Guidance**: [Exact per-piece silver hallmarking fee: Verify against current BIS notification, as this scheme is newly revised (Sept 2025) and fee structure may still be evolving.]

### IS 15820 : 2009 — General Requirements for Establishment and Operation of Assaying and Hallmarking Centres
- **Category**: Jewellery / Precious Metals — Infrastructure Standard
- **Scope & Applicability**: Lays down infrastructure, equipment, personnel competency, and quality-management requirements for any facility seeking BIS recognition as an Assaying & Hallmarking (A&H) Centre.
- **Mandatory Scheme / QCO Status**: Mandatory for any entity applying for A&H Centre recognition under the BIS Hallmarking Scheme.
- **Key Technical Parameters & Permissible Limits**: [Minimum lab equipment specifications (XRF machine calibration tolerance, fire-assay furnace requirements), personnel qualification criteria: Verify against official IS document.]
- **Testing & Laboratory Protocols**: BIS conducts periodic surveillance and proficiency testing of recognized A&H centres.
- **Certification & Fee Guidance**: [A&H Centre recognition fee: Verify against official BIS Conformity Assessment Regulations, 2018 fee schedule.]

---

## 5. CONSTRUCTION & CIVIL ENGINEERING MATERIALS

### IS 8112 : 2013 — 43 Grade Ordinary Portland Cement (OPC)
- **Category**: Construction Materials
- **Scope & Applicability**: General-purpose structural cement for M20–M35 grade concrete — the most widely used OPC grade for standard RCC (residential, commercial, infrastructure).
- **Mandatory Scheme / QCO Status**: Cement is under mandatory BIS ISI-mark certification via the Cement QCO; governing dept: Ministry of Consumer Affairs / DPIIT.
- **Key Technical Parameters & Permissible Limits**:

| Parameter | Value | Clause |
|---|---|---|
| 28-day compressive strength (min) | 43 MPa | Cl. 6.2, Table 4 |
| 28-day compressive strength (max) | 58 MPa | Cl. 6.2, Table 4 |
| 7-day compressive strength (min) | 33 MPa | Cl. 6.2, Table 4 |
| 3-day compressive strength (min) | 23 MPa | Cl. 6.2, Table 4 |
| Fineness — Blaine specific surface (min) | 225 m²/kg | Cl. 6.1.1 |
| Soundness — Le Chatelier (max) | 10 mm | Cl. 6.1.2 |

- **Testing & Laboratory Protocols**: Compressive strength tested per IS 4031 on IS 650 standard sand mortar cubes at 3/7/28-day intervals; soundness and setting-time tests mandatory per batch.
- **Certification & Fee Guidance**: ISI license; MSME concessions (80%/50%/20% for micro/small/medium) apply to marking fees.

### IS 1489 — Portland Pozzolana Cement (PPC)
- **Category**: Construction Materials
- **Scope & Applicability**: Blended cement using fly ash or calcined clay pozzolana — preferred for mass concrete/durability-critical applications due to lower heat of hydration than OPC.
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark under Cement QCO.
- **Key Technical Parameters & Permissible Limits**: [28-day compressive strength minimum, pozzolana content %, fineness: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Compressive strength, soundness, and pozzolanic-activity index testing per IS 1727/IS 4031.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 1786 : 2008 — High Strength Deformed Steel Bars and Wires (TMT Bars)
- **Category**: Construction Materials
- **Scope & Applicability**: Reinforcement steel bars (TMT) for RCC construction — the standard buyers/procurement teams specify by grade for structural safety compliance.
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark under the Steel QCO (Ministry of Steel + BIS).
- **Key Technical Parameters & Permissible Limits**:

| Grade | Min. Yield Strength (MPa) | Min. UTS (MPa) | Min. Elongation | Typical Use |
|---|---|---|---|---|
| Fe415 | 415 | 485 | 14.5% | Low-rise residential |
| Fe500 | 500 | 545 | 12% | Standard RCC — most common |
| Fe500D | 500 | 565 | 16% | Seismic zones III/IV, high-rise |
| Fe550 | 550 | 585 | 10% | Large-span, heavy industrial |
| Fe550D | 550 | 600 | 14.5% | High-seismic-risk, critical infra |
| Fe600 | 600 | 660 | 10% | Specialised high-strength structural |

- **Testing & Laboratory Protocols**: Tensile test, bend/re-bend test, chemical composition (carbon, sulphur, phosphorus per IS 228), carbon-equivalent test for weldability (D-grades). BIS lab testing charge for full IS 1786 scope ≈ ₹8,800 (BIS LIMS listing).
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 4926 — Ready Mixed Concrete (RMC)
- **Category**: Construction Materials
- **Scope & Applicability**: Code of practice for production, quality control, and delivery of ready-mixed concrete from batching plants.
- **Mandatory Scheme / QCO Status**: [Verify current mandatory/voluntary certification status against latest BIS QCO list — RMC plants commonly hold voluntary BIS certification and mandatory local pollution/municipal clearances; confirm before stating BIS certification is compulsory nationwide.]
- **Key Technical Parameters & Permissible Limits**: [Slump tolerance, batching accuracy tolerances: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Slump test, compressive-strength cube testing per IS 456/IS 516.
- **Certification & Fee Guidance**: [Verify against current BIS Scheme-I fee schedule for RMC plant certification.]

### IS 2062 — Hot Rolled Medium and High Tensile Structural Steel
- **Category**: Construction Materials
- **Scope & Applicability**: Structural steel (plates, sections) used in steel-frame buildings, bridges, and industrial structures.
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark under the Steel QCO.
- **Key Technical Parameters & Permissible Limits**: [Yield strength grades (E250/E350/E450 etc.), Charpy impact-test requirements for low-temperature grades: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Tensile, bend, and (for certain grades) impact testing.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 456 — Code of Practice for Plain and Reinforced Concrete
- **Category**: Construction Materials — Code of Practice
- **Scope & Applicability**: The master design/execution code for RCC structures in India — covers mix design principles, durability/exposure classes, cover requirements, and structural detailing rules.
- **Mandatory Scheme / QCO Status**: Not a product-certification standard — it's a **code of practice** referenced by law/municipal building codes and structural design consultants; not subject to ISI marking.
- **Key Technical Parameters & Permissible Limits**: [Minimum cement content, max w/c ratio by exposure class, cover thickness tables: Verify against official IS document — these are structural-safety-critical parameters.]
- **Testing & Laboratory Protocols**: Not a testing standard per se; invokes IS 516 (compressive strength), IS 1199 (sampling) for verification during construction.
- **Certification & Fee Guidance**: Not applicable (no BIS product license; compliance is a design/construction-practice obligation enforced via municipal building codes and structural engineer sign-off).

### IS 800 — Code of Practice for General Construction in Steel
- **Category**: Construction Materials — Code of Practice
- **Scope & Applicability**: Design code for steel structural members (limit-state design method).
- **Mandatory Scheme / QCO Status**: Not a product-certification standard; a design code referenced in structural engineering practice.
- **Key Technical Parameters & Permissible Limits**: [Partial safety factors, slenderness-ratio limits: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Not applicable directly; invokes IS 2062 material certification and site NDT (ultrasonic/radiographic weld testing) as needed.
- **Certification & Fee Guidance**: Not applicable (no BIS license; compliance verified via structural design review).

---

## 6. AUTOMOTIVE & TRANSPORT SAFETY

### IS 4151 — Protective Helmets for Two-Wheeler Riders
- **Category**: Automotive Safety
- **Scope & Applicability**: Protective helmets for motorcycle/scooter riders — a mandatory road-safety product under the Motor Vehicles Act.
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark under the Helmet QCO (a widely enforced consumer-safety QCO, given the correlation between substandard helmets and road-fatality severity); governing dept: Ministry of Road Transport & Highways + BIS.
- **Key Technical Parameters & Permissible Limits**: [Impact-absorption (shock transmission) limits, penetration-resistance criteria, minimum shell weight/thickness: Verify against official IS document — these are life-safety-critical figures and must not be approximated.]
- **Testing & Laboratory Protocols**: Impact test (drop test onto anvil), penetration test, retention-system (strap) strength test, peripheral vision test.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply. Consumer tip: only ISI-marked helmets with the BIS license number are legally compliant — non-ISI "helmet-shaped" products sold widely are non-compliant.

### IS 15633 — Pneumatic Tyres for Passenger Cars
- **Category**: Automotive Safety
- **Scope & Applicability**: Passenger car pneumatic tyres.
- **Mandatory Scheme / QCO Status**: [Verify current QCO status — automotive tyres are covered under mandatory BIS certification per the Tyre QCO; confirm exact effective date and current IS number scope against latest MoRTH/BIS notification before citing.]
- **Key Technical Parameters & Permissible Limits**: [Load index, speed rating test criteria, tread-wear indicators: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Endurance test, high-speed test, strength (plunger) test.
- **Certification & Fee Guidance**: ISI license where mandatory; MSME concessions apply.

### IS 2553 — Safety Glass for Automotive Vehicles
- **Category**: Automotive Safety
- **Scope & Applicability**: Laminated/toughened safety glass for windshields and windows.
- **Mandatory Scheme / QCO Status**: [Verify current QCO applicability against latest BIS notification.]
- **Key Technical Parameters & Permissible Limits**: [Fragmentation test criteria, light transmittance minimum: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Impact/fragmentation test, optical-distortion test.
- **Certification & Fee Guidance**: [Verify against current BIS fee schedule.]

### IS 15965 — Child Restraint Systems for Automobiles
- **Category**: Automotive Safety
- **Scope & Applicability**: Child car seats/restraint systems.
- **Mandatory Scheme / QCO Status**: Mandatory BIS certification introduced as part of child-safety-in-vehicles regulations under MoRTH; [confirm exact QCO effective date against official notification].
- **Key Technical Parameters & Permissible Limits**: [Crash-test deceleration limits, harness strength requirements: Verify against official IS document — life-safety-critical.]
- **Testing & Laboratory Protocols**: Dynamic crash-sled testing, buckle-release-force testing.
- **Certification & Fee Guidance**: [Verify against current BIS Scheme-I fee schedule.]

---

## 7. CHILDREN'S TOYS & SAFETY (Mandatory QCO)

**Category-wide note**: The **Toys (Quality Control) Order, 2020** took effect **1 January 2021**, making it mandatory for toys to conform to specified Indian Standards and carry the ISI mark under a BIS licence — no person may manufacture, import, sell, distribute, store, or exhibit non-compliant toys. As of March 2023, **BIS had granted 1,097 licences to domestic toy manufacturers, of which 1,061 (96.7%) went to MSMEs** — reflecting the sector's MSME-heavy structure. Standards were substantially revised in **IS 9873:2025**.

### IS 9873 (Part 1) — Safety of Toys: Mechanical and Physical Properties
- **Category**: Toys (Mandatory QCO)
- **Scope & Applicability**: Tests for choking hazards, sharp points/edges, finger-crush clearances — equivalent to ISO 8124-1:2018.
- **Mandatory Scheme / QCO Status**: Mandatory under Toys QCO 2020, effective 1 Jan 2021.
- **Key Technical Parameters & Permissible Limits**: [Small-parts cylinder test dimensions, sharp-point test force thresholds: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Small-parts test, sharp-edge/point test, torque/tension test on attached parts.
- **Certification & Fee Guidance**: ISI license (CM/L number mandatory on product); BIS relaxed the in-house testing-facility requirement for micro-scale toy units for up to 3 years (extended from an initial 1-year COVID-relief window) per PIB record. MSME concessions apply (80%/50% micro/small).

### IS 9873 (Part 2) — Safety of Toys: Flammability
- **Category**: Toys (Mandatory QCO)
- **Scope & Applicability**: Ensures toys don't catch fire easily / cause burns.
- **Mandatory Scheme / QCO Status**: Mandatory under Toys QCO 2020.
- **Key Technical Parameters & Permissible Limits**: [Burn-rate threshold, flame-exposure duration test criteria: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Flame-exposure test per prescribed toy-material categories (soft-filled, textile, rigid).
- **Certification & Fee Guidance**: Covered under the same ISI toy license; MSME concessions apply.

### IS 9873 (Part 3) — Safety of Toys: Migration of Certain Elements (Toxicity)
- **Category**: Toys (Mandatory QCO)
- **Scope & Applicability**: Regulates migration limits for **lead, mercury, cadmium, arsenic, chromium, selenium, and barium** in toy materials (plastics, paints, coatings, metals, textiles) — critical given children mouth/chew toys.
- **Mandatory Scheme / QCO Status**: Mandatory under Toys QCO 2020; tested per IS 9873-3:2017 and cross-referenced ISO 8124-3:2010.
- **Key Technical Parameters & Permissible Limits**: [Exact mg/kg migration limits per element: Verify against official IS document — these are child-safety-critical figures and must be confirmed against the current edition rather than approximated.]
- **Testing & Laboratory Protocols**: Elemental migration testing per element (BIS-recognized lab charge ≈ ₹375–500 per element tested, ≈ ₹3,000–4,000 for the full 7-element panel per BIS LIMS listings).
- **Certification & Fee Guidance**: Covered under the ISI toy license; MSME concessions apply.

### IS 15644 — Safety of Electric Toys
- **Category**: Toys (Mandatory QCO)
- **Scope & Applicability**: Electrical safety for battery-operated/mains-connected toys.
- **Mandatory Scheme / QCO Status**: Mandatory under Toys QCO 2020, referenced alongside the IS 9873 series.
- **Key Technical Parameters & Permissible Limits**: [Max permissible voltage for accessible parts, battery-compartment security test: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Electrical safety test, battery-access/swallow-hazard test.
- **Certification & Fee Guidance**: Covered under the ISI toy license; MSME concessions apply.

---

## 8. PERSONAL PROTECTIVE EQUIPMENT (PPE) & MEDICAL SAFETY

### IS 16289 — Surgical Face Masks
- **Category**: PPE / Medical Safety
- **Scope & Applicability**: Surgical face masks for medical/healthcare use.
- **Mandatory Scheme / QCO Status**: [Verify current mandatory/voluntary BIS certification status — medical-device-adjacent products may fall under CDSCO/Ministry of Health regulation in addition to or instead of BIS; confirm current governing authority before citing as BIS-mandatory.]
- **Key Technical Parameters & Permissible Limits**: [Bacterial filtration efficiency %, breathability/differential pressure limits: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Filtration-efficiency testing, splash-resistance testing.
- **Certification & Fee Guidance**: [Verify against current BIS/CDSCO fee schedule.]

### IS 9473 — Respiratory Protective Devices (incl. N95-type Filtering Half Masks)
- **Category**: PPE / Medical Safety
- **Scope & Applicability**: Classification, construction, performance, and testing for respiratory protective devices — sets filtration efficiency, breathing resistance, inward leakage, and mechanical-strength parameters.
- **Mandatory Scheme / QCO Status**: BIS certification mandatory for legal manufacture/sale in India; non-certified respiratory protective devices are a regulatory violation.
- **Key Technical Parameters & Permissible Limits**: [Exact filtration efficiency % (e.g., ≥95% for N95-equivalent class), breathing-resistance thresholds (mmH₂O), inward-leakage %: Verify against official IS document — safety-critical, do not approximate given these figures directly determine protective performance.]
- **Testing & Laboratory Protocols**: Filtration-efficiency test (typically against NaCl/paraffin oil aerosol), breathing-resistance test, inward-leakage test on human subjects/test rigs, and mechanical-strength (strap) test.
- **Certification & Fee Guidance**: ISI license mandatory; MSME concessions apply.

### IS 2925 — Industrial Safety Helmets
- **Category**: PPE / Medical Safety
- **Scope & Applicability**: Head-protection helmets for industrial/construction workers.
- **Mandatory Scheme / QCO Status**: [Verify current QCO/mandatory-certification status against latest BIS notification — industrial PPE items have been progressively brought under QCOs in recent years; confirm effective date.]
- **Key Technical Parameters & Permissible Limits**: [Shock-absorption criteria, penetration resistance: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Impact test, penetration test, flame-resistance test.
- **Certification & Fee Guidance**: [Verify against current BIS Scheme-I fee schedule.]

### IS 15298 — Personal Protective Equipment: Safety Footwear
- **Category**: PPE / Medical Safety
- **Scope & Applicability**: Multi-part standard covering safety, protective, and occupational footwear (steel-toe, chemical-resistant, etc.).
- **Mandatory Scheme / QCO Status**: [Verify current QCO status — PPE footwear was brought under mandatory BIS certification via a QCO in recent years; confirm exact effective date against official gazette notification.]
- **Key Technical Parameters & Permissible Limits**: [Toe-cap impact-resistance rating (Joules), slip-resistance coefficient: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Toe-impact test, compression test, slip-resistance test.
- **Certification & Fee Guidance**: [Verify against current BIS fee schedule.]

### IS 15354 — Single-Use Medical Examination Gloves
- **Category**: PPE / Medical Safety
- **Scope & Applicability**: Disposable examination gloves (latex/nitrile) for medical use.
- **Mandatory Scheme / QCO Status**: [Verify current mandatory/voluntary status and whether CDSCO medical-device classification also applies, in addition to or instead of BIS certification.]
- **Key Technical Parameters & Permissible Limits**: [Tensile strength, pinhole-defect AQL (Acceptable Quality Level): Verify against official IS document.]
- **Testing & Laboratory Protocols**: Watertight (pinhole) test, tensile/elongation test.
- **Certification & Fee Guidance**: [Verify against current fee schedule and applicable governing authority.]

---

## 9. CHEMICALS, LPG & DOMESTIC SAFETY

### IS 3196 (Part 1) : 2013 — Welded Low Carbon Steel Cylinders for LPG
- **Category**: Chemicals / Domestic Safety
- **Scope & Applicability**: Welded low-carbon-steel cylinders exceeding 5-litre water capacity for low-pressure liquefiable gases — **Part 1 specifically covers LPG cylinders** (domestic cooking-gas cylinders). Related parts: Part 2 (non-toxic liquefiable gases other than LPG), Part 4 (toxic/corrosive gases, amalgamating former IS 7680/7681/7682).
- **Mandatory Scheme / QCO Status**: Mandatory BIS ISI-mark certification — a critical household-safety standard given fire/explosion risk; governing dept: Ministry of Petroleum & Natural Gas + BIS.
- **Key Technical Parameters & Permissible Limits**: Standard covers material specification, welding quality, pressure-relief-device specification, valve fittings. [Exact hydraulic test pressure, burst-pressure minimum, and wall-thickness tolerance: Verify against official IS document — safety-critical, must not be approximated given explosion risk.]
- **Testing & Laboratory Protocols**: Hydraulic pressure test, burst-pressure test, and leakage test are mandatory per-cylinder/per-batch checks at every stage: raw-material selection, manufacturing, and intermediate quality checks (per official BIS "BIS Talks" explainer on LPG cylinder manufacturing).
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 4246 — Domestic Gas Stoves for use with LPG
- **Category**: Chemicals / Domestic Safety
- **Scope & Applicability**: LPG-fuelled domestic cooking stoves.
- **Mandatory Scheme / QCO Status**: Mandatory ISI mark; governing dept: Ministry of Petroleum & Natural Gas + BIS.
- **Key Technical Parameters & Permissible Limits**: [Thermal efficiency minimum %, burner flame-stability criteria, leak-tightness test pressure: Verify against official IS document — safety-critical.]
- **Testing & Laboratory Protocols**: Leak test, thermal-efficiency test, flame-stability/spillage test.
- **Certification & Fee Guidance**: ISI license; MSME concessions apply.

### IS 5408 — Technical Urea
- **Category**: Chemicals
- **Scope & Applicability**: Industrial/technical-grade urea (distinct from agricultural fertilizer-grade urea, which falls under Fertiliser Control Order).
- **Mandatory Scheme / QCO Status**: [Verify current mandatory/voluntary BIS certification status against latest QCO list for industrial chemicals.]
- **Key Technical Parameters & Permissible Limits**: [Nitrogen content %, biuret content max, moisture content max: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Chemical assay (nitrogen/biuret content), moisture testing.
- **Certification & Fee Guidance**: [Verify against current fee schedule.]

### IS 252 — Caustic Soda
- **Category**: Chemicals
- **Scope & Applicability**: Industrial caustic soda (sodium hydroxide) specification.
- **Mandatory Scheme / QCO Status**: [Verify current mandatory/voluntary BIS certification status against latest Chemicals QCO list — several industrial chemicals were brought under QCOs in recent regulatory expansion; confirm current status for caustic soda specifically.]
- **Key Technical Parameters & Permissible Limits**: [NaOH concentration grades, impurity (chloride, iron) limits: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Titration-based purity assay, impurity testing.
- **Certification & Fee Guidance**: [Verify against current fee schedule.]

---

## 10. RENEWABLE ENERGY & SOLAR STORAGE

### IS 14286 : 2010 — Terrestrial Photovoltaic (PV) Modules (Crystalline Silicon)
- **Category**: Renewable Energy
- **Scope & Applicability**: Crystalline-silicon (Si-wafer-based) terrestrial PV modules — qualification testing aligned with **IEC 61215**. (Thin-film modules are separately covered under IS 16077:2013.)
- **Mandatory Scheme / QCO Status**: Mandatory **Compulsory Registration Scheme (CRS)** certification; also required for **ALMM (Approved List of Models and Manufacturers)** eligibility, which is mandatory for any solar project availing government subsidy (PM Surya Ghar, SECI tenders, MNRE-funded projects). Governing dept: Ministry of New & Renewable Energy (MNRE) + BIS.
- **Key Technical Parameters & Permissible Limits**: [Power-output tolerance %, thermal-cycling test cycles, damp-heat test duration per IEC 61215 qualification sequence: Verify against official IS document.]
- **Testing & Laboratory Protocols**: IEC 61215-aligned qualification testing (thermal cycling, damp heat, mechanical load, hot-spot, UV exposure); typical certification timeline **6–12 months** for a new product (per industry technical reference), BIS-accredited lab capacity is a known bottleneck.
- **Certification & Fee Guidance**: CRS registration; MSME concessions apply.

### IS 16221 — Safety of Power Converters for use in Photovoltaic Power Systems
- **Category**: Renewable Energy
- **Scope & Applicability**: Grid-tied solar inverters — covers safety, anti-islanding protection, harmonic-distortion limits, aligned with IEC 62109 and IEEE 1547.
- **Mandatory Scheme / QCO Status**: Mandatory for DISCOM/ALMM acceptance of grid-tied inverters; governing dept: MNRE + BIS.
- **Key Technical Parameters & Permissible Limits**: [Anti-islanding trip time, total harmonic distortion (THD) limit %: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Anti-islanding test, harmonic-distortion test, grid-behaviour compliance test.
- **Certification & Fee Guidance**: CRS/ISI registration as applicable; MSME concessions apply.

### IS 1651 — Stationary Lead-Acid Batteries for Solar Photovoltaic Systems
- **Category**: Renewable Energy
- **Scope & Applicability**: Lead-acid batteries used for solar-PV energy storage (note: some industry references cite the closely related IS 16270 for stationary lead-acid batteries generally — confirm the precise IS number applicable to your specific battery configuration).
- **Mandatory Scheme / QCO Status**: [Verify current mandatory/voluntary BIS certification status against latest MNRE/BIS notification for solar-storage batteries — this is an evolving regulatory area given the push for battery-storage standardisation under PM Surya Ghar and grid-storage schemes.]
- **Key Technical Parameters & Permissible Limits**: [Cycle-life rating, depth-of-discharge tolerance, capacity-retention test criteria: Verify against official IS document.]
- **Testing & Laboratory Protocols**: Capacity test, cycle-life test, charge-retention test.
- **Certification & Fee Guidance**: [Verify against current fee schedule.]

---

## 11. Related IT / Equivalent Cross-Reference Standards (mentioned in category 6 list from problem set)

*Note: The original 50-item list had a numbering duplication (two entries labelled "category 4" and "category 9" missing) — Chemicals/LPG/Domestic Safety (originally mislabeled "#9") and Renewable Energy (originally "#10") have been correctly placed above under their own headings 9 and 10. If your source list intended additional distinct standards beyond the 47 uniquely identifiable IS numbers actually provided, flag those for a follow-up research pass — three of the originally listed 50 slots referenced categories that overlapped in the source numbering.*

---

## 12. CROSS-CUTTING: BIS MSME FEE CONCESSION FRAMEWORK (applies across all categories above)

This is the master concession structure your Fee Estimator feature (and any certification-guidance answer) should reference:

| Enterprise Category | Fee Concession | Basis |
|---|---|---|
| Micro-scale enterprises | **80%** concession on certification/marking fees | BIS notification under Scheme-I §5(2), Scheme-II §5(6), Scheme-IV §5(2) of BIS (Conformity Assessment) Regulations, 2018 |
| Small-scale enterprises | **50%** concession | Same regulatory basis |
| Medium-scale enterprises | **20%** concession | Same regulatory basis |
| DPIIT-recognized Start-ups | **80%** concession (aligned with micro-scale treatment) | Same notification |
| Women-entrepreneur MSMEs | **Additional 10%** concession on top of the applicable category concession | Same notification |
| Existing licensees (renewal, micro-scale) | Additional 10% concession on annual minimum marking fee | PIB / BIS circular |

**Eligibility documentation**: Udyam Registration Certificate (for MSME classification, per MSME Development Act 2006) and/or DPIIT Certificate of Eligible Business (under Section 80-IAC, Income Tax Act 1961) for start-ups.

**Important currency note**: These concessions were extended through a window originally set to expire **31 May 2026**. As of a recent government statement, BIS has **moved a proposal to extend these concessions by a further three years** beyond the mid-2026 deadline — this had not been finalized as of the source reporting date. **Your assistant should treat this expiry date as a live variable and re-check it periodically rather than hardcoding "valid until May 2026" into responses**, since the extension proposal may or may not have been approved by the time your system is actually used by judges/consumers.

**Sources for this section**: PIB press releases (static.pib.gov.in), BIS circular CMD-2/G-18 (24 May 2023) as reported via secondary regulatory-advisory sources, and Outlook Business reporting on the proposed extension.

---

## Appendix A — Source Index (for citation-badge feature)

| # | Source | URL | Used For |
|---|---|---|---|
| 1 | BIS Circular — Product Manual IS 10500:2012 | services.bis.gov.in | Water certification scheme |
| 2 | Foxmandal legal advisory | foxmandal.in | 2026 FSSAI packaged-water testing scheme transition |
| 3 | BIS LIMS lab scope listings | lims.bis.gov.in | Testing fees, clause numbers (water, TMT bars, toys) |
| 4 | infralens.in technical reference | infralens.in | IS 10500, IS 8112, IS 1786 parameter tables |
| 5 | Nemko BIS CRS product certification page | nemko.com | CRS product list (LED, mobile, batteries, IT equipment) |
| 6 | BIS official Hallmarking FAQ | bis.gov.in | IS 1417/2112 caratage/fineness grades, HUID system |
| 7 | BIS official blog — Hallmarking of Gold Jewellery | services.bis.gov.in | HUID rollout dates, hallmarking fee (₹45/piece) |
| 8 | Bhima Gold consumer guide | bhimagold.com | 9K gold addition (Jul 2025), silver voluntary hallmarking (Sep 2025) |
| 9 | ofbusiness.com TMT bar grade guide | ofbusiness.com | Fe415–Fe600 grade table |
| 10 | BIS official — Toys QCO explainer | services.bis.gov.in | Toys QCO 2020 scope, 7 IS standards list |
| 11 | India Briefing (Dezan Shira & Associates) | india-briefing.com | IS 9873:2025 revision context |
| 12 | PIB / Consumer Affairs Ministry — Lok Sabha reply | consumeraffairs.nic.in | MSME toy-licence statistics, in-house testing relaxation |
| 13 | PIB — BIS initiatives document | static.pib.gov.in | MSME fee concession structure |
| 14 | Outlook Business — concession extension reporting | outlookbusiness.com | Fee concession 3-year extension proposal |
| 15 | alephindia.in certification advisory pages | alephindia.in | LPG cylinder (IS 3196), N95 (IS 9473), Solar PV (IS 14286) scope descriptions |
| 16 | quickestimate.co solar BIS glossary | quickestimate.co | ALMM/solar certification context, IS 16221/14286 cross-reference |

---

**Ingestion instruction for your RAG pipeline**: Chunk this document by `###` heading (one chunk per IS standard) so each retrieved chunk maps to exactly one standard with its own citation. Preserve the `[Verify against official IS document]` markers as literal retrievable text — do not strip them during chunking — so the LLM generation step surfaces the uncertainty flag to the end user rather than silently dropping it.