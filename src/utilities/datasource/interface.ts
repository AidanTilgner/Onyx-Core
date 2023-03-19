import { Interface } from "docs/interfaces";
import { database, initializeDB, entities } from "./module";
import queries from "./module/queries/index";

class DataSourceInterface extends Interface {
  constructor() {
    super("DataSource");
  }

  public async initDB() {
    return await initializeDB();
  }

  public useDataBase() {
    return database;
  }

  public useEntities() {
    return entities;
  }

  public useManager() {
    return database.manager;
  }

  public useQueries() {
    return queries;
  }
}

export default DataSourceInterface;
