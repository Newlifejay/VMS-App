// Temporary mock to fix build error.
// The actual database implementation using 'mssql' seems to be missing in this project.
// If you're switching to Supabase, we'll need to refactor the queries that use getDb().

export default async function getDb() {
  return {
    request: () => {
      const builder = {
        input: function (param: string, value: any) { 
          return this; 
        },
        query: async (sql: string) => {
          console.log("Mock DB Query Executed:", sql);
          return { recordset: [] }; // Return mock empty data
        }
      };
      return builder;
    }
  };
}
