Step 1.
Update the `view_lookup.csv` file with new table version name(s).

Step 2.
Run `python update_carto_views.py {APIKEY}`. This script intakes the Carto API key as a system argument and then GETs all the Carto SQL API calls, recreating indices and views for each table in the CSV file.

Note: You can query on Carto to see all views and their definitions using this SQL snippet:
`SELECT viewname, definition FROM pg_views WHERE schemaname = 'planninglabs' ORDER BY viewname`
