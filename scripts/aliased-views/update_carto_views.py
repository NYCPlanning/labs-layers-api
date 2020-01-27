import sys
import pandas as pd
import requests

# APIKEY entered as a system argument in the command line
# `python update_carto_views.py {APIKEY}`
api_key = sys.argv[1]

# opens the csv file and saves it as a pandas dataframe called df
# pandas is a library for manipulating tabular data
df = pd.read_csv('view_lookup.csv')

def run_carto_query(sql):
    # function that runs the API call to Carto using the SQL snippets generated in the for loop below
    carto_base_url = 'https://planninglabs.carto.com/api/v2/sql?q='
    query_url = carto_base_url + sql + '&api_key=' + api_key
    response = requests.get(query_url)
    if(response.status_code == 200):
        return print('Success!')
    else:
        return print(requests.get(query_url), query_url)

# iterating through each row in table
for index, row in df.iterrows():
    table_name = row.table_name
    view_name = row.view_name
    index_column = row.index_column # column in dataset to create PSQL index on

    # if an index column is provided, this generates the SQL to create the index in PSQL
    # it plugs in the table_name and index_column values based on the order in the list after the string template
    if(index_column != 'none'):
        # %s = variable that get plugged into string template
        sql_index = 'DROP INDEX IF EXISTS idx_%s_%s; CREATE INDEX idx_%s_%s ON %s (%s);' % (table_name, index_column, table_name, index_column, table_name, index_column)
        run_carto_query(sql_index)

    # this generates the SQL to create the view in PSQL
    # it plugs in the table_name and view_name values based on the order in the list after the string template
    sql_view = 'DROP VIEW IF EXISTS %s; CREATE VIEW %s AS (SELECT * FROM %s); GRANT SELECT ON %s TO publicuser;' % (view_name, view_name, table_name, view_name)
    run_carto_query(sql_view)
