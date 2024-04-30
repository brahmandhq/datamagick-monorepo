import { DataSource } from "typeorm";
import { MongoClient } from "mongodb";
import { createClient, RedisClientType } from 'redis';
import { Client as ElasticClient } from '@elastic/elasticsearch';

// import { log } from "console";

abstract class DataSourceConnection {
  client: RedisClientType | ElasticClient | DataSource | MongoClient | undefined;
  connectionString: string;
  static connectQuery: string;
  static generateQueryTemplate: string;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getSchema(): Promise<void>;
  abstract query(query: string): Promise<any>;
  abstract generateQuery(databaseDetails: string): string;
  abstract queryExplain(databaseDetails: string): string;
  abstract generateChart(databaseDetails: string, query: string): string;
}

export class PostgresDatabase extends DataSourceConnection {
  client: DataSource;
  static connectQuery = `select table_name, column_name, data_type from information_schema.columns where table_name in (select tablename from pg_tables where schemaname = 'public' and tablename != '_prisma_migrations')`;
  static generateQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
There is a Postgres database with these tables and their columns: {SCHEMA}
User will ask you to generate a SQL query for that database. Absolute must rules to follow:
1. Respond with absolutely zero explanation and filler words
2. SQL statement should be 100% accurate, short, and efficient
3. Wrap the table name keywords in double quotes`;
  static explainQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
There is a Postgres database with these tables and their columns: {SCHEMA}
The user will ask you to explain a SQL query for that database. Here's what you need to do:
1. Explain what the SQL query does in simple terms, as if you were talking to someone who doesn't know SQL.
2. Break down the query into its key components, explaining each part's role in the overall operation.
3. Include a final sentence summarizing the query's purpose in simple terms again.`;
  static generateChartTemplate = `You are ChatGPT, a large language model trained by OpenAI that is designed to output JSON. Follow the user's instructions carefully.
There is a Postgres database with a table with these columns: {SCHEMA}
The user will give you an a SQL query: {QUERY} for that database. Here's what you need to do:
1. Determine the appropriate chart type (line, bar, pie) for visualizing the data.
2. Identify the X and Y axis for the chart, ensuring they are relevant to the non-aggregation axis label.Use the exact field names from the database as labels for the axes

Please provide your responses in the following structured format:
{
 "chartType": "chart type (line, bar, pie)",
 "axes": {
    "xAxis": "Exact Field Name for X-axis",
    "yAxis": "Exact Field Name for Y-axis"
 }
 
 Please provide your responses in JSON format.`;

  constructor(connectionString: string) {
    super(connectionString);
    process.stdout.write(`connection string: ${this.connectionString}`);
    this.client = new DataSource({
      type: "postgres",
      url: this.connectionString,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.initialize();
    } catch (e) {
      process.stdout.write(`connect error was this: ${e}`);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.destroy();
  }

  async query(query: string): Promise<any> {
    const result = await this.client.query(query);
    return result;
  }

  async getSchema(): Promise<any> {
    const result = await this.query(PostgresDatabase.connectQuery);
    return result;
  }

  generateQuery(databaseDetails: string): string {
    return PostgresDatabase.generateQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  queryExplain(databaseDetails: string): string {
    return PostgresDatabase.explainQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }
  generateChart(databaseDetails: string, query: string): string {
    return PostgresDatabase.generateChartTemplate
      .replace("{SCHEMA}", databaseDetails)
      .replace("{QUERY}", query);
  }
}

export class MysqlDatabase extends DataSourceConnection {
  client: DataSource;
  static connectQuery = `SELECT table_name, column_name, column_type FROM information_schema.columns WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys') AND table_name NOT LIKE '_prisma_migrations' AND table_schema NOT LIKE 'INFORMATION_SCHEMA' AND table_schema NOT LIKE 'PERFORMANCE_SCHEMA' ORDER BY table_name, ordinal_position;`;
  static generateQueryTemplate = ""; // Implement the logic to generate query for MysqlDatabase
  static explainQueryTemplate = "";
  static generateChartTemplate = "";

  constructor(connectionString: string) {
    super(connectionString);
    this.client = new DataSource({
      type: "mysql",
      url: this.connectionString,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  async connect(): Promise<void> {
    await this.client.initialize();
  }

  async disconnect(): Promise<void> {
    await this.client.destroy();
  }

  async query(query: string): Promise<any> {
    const result = await this.client.query(query);
    return result;
  }

  async getSchema(): Promise<any> {
    const result = await this.query(MysqlDatabase.connectQuery);
    return result;
  }

  generateQuery(databaseDetails: string): string {
    return MysqlDatabase.generateQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  queryExplain(databaseDetails: string): string {
    return MysqlDatabase.explainQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  generateChart(databaseDetails: string, query: string): string {
    return MysqlDatabase.generateChartTemplate
      .replace("{SCHEMA}", databaseDetails)
      .replace("{QUERY}", query);
  }
}

export class MongoDatabase extends DataSourceConnection {
  client: MongoClient;
  // static connectQuery = `db.collection("information_schema.columns").find({ "$and": [ { "table_name": { "$not": /_prisma_migrations/ } }] }, { "table_name": 1, "column_name": 1, "data_type": 1 })`;
  static connectQuery = "";
  static generateQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
There is a mongodb database with these collection and their fields: {SCHEMA}
User will ask you to generate a mongodb query for that database. Absolute must rules to follow:
1. Respond with absolutely zero explanation and filler words
2. mongodb queries statement should be 100% accurate, short, and efficient
3.  use collection_name like this db.collection("collection_name") 
4. except aggregation query add .toArray() at the end of the every query`;
  static explainQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
There is a MongoDB database with these collections and their fields: {SCHEMA}
The user will ask you to explain a MongoDB query for that database. Here's what you need to do:
1. Explain what the MongoDB query does in simple terms, as if you were talking to someone who doesn't know MongoDB.
2. Break down the query into its key components, explaining each part's role in the overall operation.
3. Include a final sentence summarizing the query's purpose in simple terms again.
`;
  static generateChartTemplate = "";

  constructor(connectionString: string) {
    super(connectionString);
    this.client = new MongoClient(this.connectionString);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async query(query: string): Promise<any> {
    const databasename = this.client.db().databaseName;
    // @ts-ignore
    const db = this.client.db(databasename);

    const collections = await db.listCollections().toArray();
    let results: any[] = [];

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const queryResult = await collection.find({}).toArray();

      if (queryResult.length > 0) {
        const document = queryResult[0];
        for (const key in document) {
          const collectionData = {
            table_name: collectionName,
            column_name: key,
            data_type: typeof document[key],
          };
          results.push(collectionData);
        }
      }
    }

    if (query) {
      results = await eval(query)
    }

    return results;
  }

  async getSchema(): Promise<any> {
    const result = await this.query(MongoDatabase.connectQuery);
    return result;
  }

  generateQuery(databaseDetails: string): string {
    return MongoDatabase.generateQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  queryExplain(databaseDetails: string): string {
    return MongoDatabase.explainQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  generateChart(databaseDetails: string, query: string): string {
    return MongoDatabase.generateChartTemplate
      .replace("{SCHEMA}", databaseDetails)
      .replace("{QUERY}", query);
  }
}

class RedisDatabase extends DataSourceConnection {
  client: RedisClientType
  static connectQuery = `KEYS *`;
  static generateQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
  Given a Redis database, the user will ask you to generate commands for manipulating or querying data. Your responses should:
  1. Be succinct, accurate, and adhere strictly to Redis command syntax.
  2. Not include any extraneous explanations or filler words.
  3. Format keys and arguments according to the Redis command's requirements.`;
  static explainQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
  When explaining a Redis command, do the following:
  1. Describe the command's purpose and how it operates in simple terms.
  2. Break down the command into its key components (e.g., key, value, options) and explain the role of each.
  3. Conclude with a summary of the command's overall effect on the database.`;
  // static generateChartTemplate = ``; 

  constructor(connectionString: string) {
    super(connectionString);
    this.client = createClient({ url: this.connectionString });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Redis connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async query(query: string): Promise<any> {
    try {
      const commandParts = query.split(" ");
      const command = commandParts.shift();
      if (command) {
        const result = await this.client[command](...commandParts);
        return result;
      }
      throw new Error('Invalid command');
    } catch (error) {
      console.error('Redis command execution failed:', error);
      return false; // Command execution failed
    }
  }

  async getSchema(): Promise<any> {
    // This is a simplistic way to get "schema" information in Redis, since Redis is not schema-based
    return this.query(RedisDatabase.connectQuery);
  }

  generateQuery(databaseDetails: string): string {
    return RedisDatabase.generateQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  queryExplain(databaseDetails: string): string {
    return RedisDatabase.explainQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  generateChart(databaseDetails: string, query: string): string {
    return null
  }

}

class ElasticsearchDatabase extends DataSourceConnection {
  client: ElasticClient;
  static connectQuery = `GET /_cat/indices?v`; // For retrieving indices information as a schema proxy
  static generateQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
  Given an Elasticsearch index, the user will ask you to generate a query for searching or manipulating documents. Ensure your responses:
  1. Are correct and efficient Elasticsearch queries in JSON format.
  2. Exclude unnecessary explanations or filler words.
3. Clearly indicate the index (if applicable) and structure the query to match Elasticsearch's DSL.`;
  static explainQueryTemplate = `You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully.
  When explaining an Elasticsearch query, you should:
  1. Simplify the query's purpose for someone unfamiliar with Elasticsearch.
  2. Dissect the query into its main components (e.g., index, query type, conditions) and explain each part's function.
  3. Summarize the intended outcome or effect of the query on the index/documents.`;
  //static generateChartTemplate = ``; 

  constructor(connectionString: string) {
    super(connectionString);
    this.client = new ElasticClient({ node: this.connectionString });
  }

  async connect(): Promise<void> {
    try {
      const response = await this.client.ping();
      console.log('Elasticsearch connection is successful', response);
    } catch (error) {
      console.error('Elasticsearch connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    // Elasticsearch client does not need explicit disconnect in current versions
  }

  async query(query: string): Promise<any> {
    try {
      const queryObject = JSON.parse(query); // Parse the query string into an object
      const response = await this.client.search(queryObject);
      console.log('Elasticsearch query executed successfully', response);
      return response;
    } catch (error) {
      console.error('Elasticsearch query execution failed', error);
      return false;
    }
  }

  async getSchema(): Promise<any> {
    // Getting schema equivalent in Elasticsearch by listing indices
    return this.query(ElasticsearchDatabase.connectQuery);
  }

  generateQuery(databaseDetails: string): string {
    return ElasticsearchDatabase.generateQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  queryExplain(databaseDetails: string): string {
    return ElasticsearchDatabase.explainQueryTemplate.replace(
      "{SCHEMA}",
      databaseDetails
    );
  }

  generateChart(databaseDetails: string, query: string): string {
    return null
  }
}


export class DataSourceConnectionFactory {
  static createDataSourceConnection(
    connectionString: string
  ): DataSourceConnection {
    if (connectionString.startsWith("postgres://")) {
      return new PostgresDatabase(connectionString);
    } else if (connectionString.startsWith("mysql://")) {
      return new MysqlDatabase(connectionString);
    } else if (connectionString.startsWith("mongodb+srv://")) {
      return new MongoDatabase(connectionString);
    } else if (connectionString.startsWith("redis://")) {
      return new RedisDatabase(connectionString);
    } else if (connectionString.startsWith("http://") || connectionString.startsWith("https://")) {
      return new ElasticsearchDatabase(connectionString);
    } 

    throw new Error("Invalid data source type");
  }

  static generateQuery(
    connectionString: string,
    databaseDetails: string
  ): string {
    const connection =
      DataSourceConnectionFactory.createDataSourceConnection(connectionString);
    return connection.generateQuery(databaseDetails);
  }

  static queryExplain(
    connectionString: string,
    databaseDetails: string
  ): string {
    const connection =
      DataSourceConnectionFactory.createDataSourceConnection(connectionString);
    return connection.queryExplain(databaseDetails);
  }

  static generateChart(
    connectionString: string,
    databaseDetails: string,
    query: string
  ): string {
    const connection =
      DataSourceConnectionFactory.createDataSourceConnection(connectionString);
    return connection.generateChart(databaseDetails, query);
  }
}
