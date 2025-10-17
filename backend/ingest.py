import pandas as pd
from dateutil import parser

def ingest_csv(file_path):
    df = pd.read_csv(
        file_path,
        on_bad_lines='skip'
    )

    print(df)

    for name_col in ['first_name', 'last_name']:
        if name_col in df.columns:
            df[name_col] = df[name_col].astype(str).str.strip().str.title()

    for date_col in ['dob', 'appointment_date']:
        if date_col in df.columns:
            def parse_date(val):
                try:
                    val = str(val).replace('/', '-')
                    return parser.parse(val, dayfirst=False).date()
                except Exception:
                    return pd.NaT

            df[date_col] = df[date_col].apply(parse_date)
         
            df[date_col] = df[date_col].astype(str)

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

    df = df.fillna('')
    df = df.replace(['<NA>', 'NaN', 'NaT', pd.NA, None], '')

    return df



