## NOTE: Since we adopted the EDM Data Pipeline for most layers, any (the majority) of these aliased views which have a formalized Data Pipeline equivalent is no longer necessary for the Layers API. 

Step 1.
Update the `view_lookup.csv` file with new table version name(s). The CSV file includes three columns: (1) the alias name (2) the name of the actual table (you will be editing this) (3) the column on which to create indices.

Step 2.
Make sure you're inside of scripts/aliased-views in the terminal. Then run `python update_carto_views.py {APIKEY}`. You can find the API key on our carto account under the API Keys tab. This script intakes the Carto API key as a system argument and then GETs all the Carto SQL API calls, recreating indices and views for each table in the CSV file.

Note: You can query on Carto to see all views and their definitions using this SQL snippet

```sql
SELECT viewname, definition 
FROM pg_views 
WHERE schemaname = 'planninglabs' 
ORDER BY viewname
```

Note: An example of the SQL snippet for one table update automated by the python script:
```sql
DROP VIEW IF EXISTS bike_routes;

CREATE VIEW bike_routes AS
	(SELECT * FROM bike_routes_v20180913);

GRANT SELECT ON bike_routes TO publicuser;
```

Note: An example of the SQL snippet for creating an index on a table. Indexes must be created before the view:
```sql
CREATE INDEX idx_mappluto_19v2_bbl ON planninglabs.mappluto_19v2 (bbl);

DROP VIEW IF EXISTS mappluto;

CREATE VIEW mappluto AS
	(SELECT * FROM mappluto_19v2);

GRANT SELECT ON mappluto TO publicuser;
```

Note: When running the python script, make sure that your version of Python is updated to the latest. You can do this by downloading Anaconda (which will also download other dependencies necessary to run the Python script, e.g. Pandas). After downloading Anaconda, make sure to run:  
```sh
echo "alias python=/usr/local/bin/python3.7" >> ~/.bashrc
```
 on your terminal to switch to the newest python version. Then CLOSE out of your terminal and reopen it. You should now be able to run the script.
