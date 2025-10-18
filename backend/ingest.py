import os
import pandas as pd
from dateutil import parser
from io import StringIO

def ingest_csv(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    cleaned_lines = []
    for line in lines:
        cleaned_line = line.strip().rstrip(',')
        cleaned_lines.append(cleaned_line)
    
    cleaned_csv_data = '\n'.join(cleaned_lines)
    
    
    df = pd.read_csv(StringIO(cleaned_csv_data))

    print(df)

    for name_col in ['first_name', 'last_name']:
        if name_col in df.columns:
            df[name_col] = df[name_col].fillna('').astype(str).str.strip().str.title()
            df[name_col] = df[name_col].replace('Nan', '')

    for date_col in ['dob', 'appointment_date']:
        if date_col in df.columns:
            def parse_date(val):
                try:
                    val = str(val).replace('/', '-')
                    parsed_date = parser.parse(val, dayfirst=False)
                    # Return date for both dob and appointment_date
                    return parsed_date.date()
                except Exception:
                    return pd.NaT

            df[date_col] = df[date_col].apply(parse_date)

    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

    if 'email' in df.columns:
        df['email'] = df['email'].str.lower().str.strip()
        # Replace [at] with @
        df['email'] = df['email'].str.replace(r'\[at\]', '@', regex=True)
        email_pattern = r"^[\w\.\-']+@[\w\.-]+\.\w+$"
        df.loc[~df['email'].str.match(email_pattern, na=False), 'email'] = pd.NA


    if 'phone' in df.columns:
        df['phone'] = df['phone'].astype(str).str.replace(r'\D', '', regex=True)
        df.loc[df['phone'].str.len() != 10, 'phone'] = pd.NA
        df.loc[df['phone'].notna(), 'phone'] = df.loc[df['phone'].notna(), 'phone'].apply(lambda x: f'+1{x}')


    df = df.replace(['<NA>', 'NaN', 'NaT', pd.NA, None], '')

    print(df)
    return df


file_path = os.path.join(os.path.dirname(__file__), "patients_and_appointments.txt")
if __name__ == "__main__":
    ingest_csv(file_path)



