import pandas as pd
from uuid import uuid4
import io

class DataValidator:
    @staticmethod
    async def process_excel(file_contents: bytes):
        # Read Excel/CSV into Pandas
        df = pd.read_excel(io.BytesIO(file_contents))
        
        # Mapping common Indian government headers to our UUID schema
        # e.g., 'Name of PHC' -> 'phc_name'
        schema_map = {
            'PHC Name': 'name',
            'Stock Level': 'current_stock',
            'Bed Count': 'bed_capacity'
        }
        df.rename(columns=schema_map, inplace=True)
        
        # Basic validation
        if 'name' not in df.columns:
            raise ValueError("Invalid Schema: Missing PHC Name")
            
        # Add UUIDs for new records
        df['id'] = [str(uuid4()) for _ in range(len(df))]
        
        return df.to_dict(orient='records')