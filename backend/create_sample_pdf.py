import os
import pymupdf

os.makedirs("data", exist_ok=True)
pdf_path = "data/IS_10500_Drinking_Water.pdf"

doc = pymupdf.open()
page1 = doc.new_page()

text_content = """
INDIAN STANDARD: IS 10500 : 2012
DRINKING WATER — SPECIFICATION (Second Revision)

1. SCOPE
This standard prescribes the requirements and the methods of sampling and test for drinking water.

2. REQUIREMENTS
Drinking water shall comply with the requirements given in Tables 1 to 4.
Thermal, organoleptic and physical parameters:
- Color: Max 5 Hazen units (Permissible limit in absence of alternate source: 15)
- Odor: Agreeable
- pH value: 6.5 to 8.5 (No relaxation)
- Total Dissolved Solids (TDS): Max 500 mg/l (Permissible limit: 2000 mg/l)
- Turbidity: Max 1 NTU (Permissible limit: 5 NTU)
- Total Hardness (as CaCO3): Max 200 mg/l (Permissible limit: 600 mg/l)
- Chloride (as Cl): Max 250 mg/l (Permissible limit: 1000 mg/l)
- Fluoride (as F): Max 1.0 mg/l (Permissible limit: 1.5 mg/l)

3. MICROBIOLOGICAL REQUIREMENTS
All water intended for drinking shall be free from pathogenic organisms and indicators of fecal pollution (E. coli or thermotolerant coliform bacteria shall be 0 per 100 ml).
"""

page1.insert_text((50, 50), text_content, fontsize=11)
doc.save(pdf_path)
doc.close()
print(f"Created sample BIS PDF standard at: {pdf_path}")
