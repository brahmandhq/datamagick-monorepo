import { PostgresDatabase, MysqlDatabase, MongoDatabase, DataSourceConnectionFactory } from "../utils/database";

describe("PostgresDatabase", () => {
    let postgresDB;

    beforeAll(() => {
        postgresDB = new PostgresDatabase("postgres://postgres.grfwztzvzpkxvvemzfgs:hxqNNxiIZ1HB9pxT@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres");
    });

    afterAll(async () => {
        await postgresDB.disconnect();
    });

    it("should connect to the database", async () => {
        await expect(postgresDB.connect()).resolves.not.toThrow();
    });

    it("should get schema from the database", async () => {
        await expect(postgresDB.getSchema()).resolves.toEqual([
            {
                "table_name": "sample_table",
                "column_name": "id",
                "data_type": "bigint"
            },
            {
                "table_name": "sample_table",
                "column_name": "name",
                "data_type": "text"
            },
            {
                "table_name": "sample_table",
                "column_name": "age",
                "data_type": "integer"
            },
            {
                "table_name": "sample_table",
                "column_name": "email",
                "data_type": "text"
            }
        ]);
    });
});

describe("MysqlDatabase", () => {
    let mysqlDB;

    beforeAll(() => {
        mysqlDB = new MysqlDatabase("mysql://3z8wgSgcFnd9xZd.root:LMCu3JrBeem8DGoV@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test");
    });

    afterAll(async () => {
        await mysqlDB.disconnect();
    });

    it("should connect to the database", async () => {
        await expect(mysqlDB.connect()).resolves.not.toThrow();
    });

    it("should get schema from the database", async () => {
        await expect(mysqlDB.getSchema()).resolves.toEqual([
            {
                "table_name": "user",
                "column_name": "id",
                "column_type": "int(11)"
            },
            {
                "table_name": "user",
                "column_name": "name",
                "column_type": "varchar(50)"
            },
            {
                "table_name": "user",
                "column_name": "city",
                "column_type": "varchar(50)"
            },
            {
                "table_name": "user",
                "column_name": "number",
                "column_type": "varchar(15)"
            },
            {
                "table_name": "vendor",
                "column_name": "id",
                "column_type": "int(11)"
            },
            {
                "table_name": "vendor",
                "column_name": "vendor_name",
                "column_type": "varchar(100)"
            },
            {
                "table_name": "vendor",
                "column_name": "bank_name",
                "column_type": "varchar(100)"
            },
            {
                "table_name": "vendor",
                "column_name": "account_number",
                "column_type": "varchar(20)"
            },
            {
                "table_name": "vendor",
                "column_name": "ifsc_code",
                "column_type": "varchar(20)"
            }
        ]);
    });
});

describe("MongoDatabase", () => {
    let mongoDB;

    beforeAll(() => {
        mongoDB = new MongoDatabase("mongodb+srv://getdevkit:1fw8bQ5L424ATJxz@sampledb.unvhcbj.mongodb.net/SampleData?retryWrites=true&w=majority&appName=SampleDB");
    });

    afterAll(async () => {
        await mongoDB.disconnect();
    });

    it("should connect to the database", async () => {
        await expect(mongoDB.connect()).resolves.not.toThrow();
    });

    it("should get schema from the database", async () => {
        await expect(mongoDB.getSchema()).resolves.toEqual([
            {
                "table_name": "data",
                "column_name": "_id",
                "data_type": "object"
            },
            {
                "table_name": "data",
                "column_name": "name",
                "data_type": "string"
            },
            {
                "table_name": "data",
                "column_name": "country",
                "data_type": "string"
            },
            {
                "table_name": "data",
                "column_name": "founded_year",
                "data_type": "number"
            },
            {
                "table_name": "userData",
                "column_name": "_id",
                "data_type": "object"
            },
            {
                "table_name": "userData",
                "column_name": "username",
                "data_type": "string"
            },
            {
                "table_name": "userData",
                "column_name": "email",
                "data_type": "string"
            },
            {
                "table_name": "userData",
                "column_name": "age",
                "data_type": "number"
            },
            {
                "table_name": "userData",
                "column_name": "address",
                "data_type": "object"
            },
            {
                "table_name": "userData",
                "column_name": "isActive",
                "data_type": "boolean"
            }
        ]);
    });

});


describe("DataSourceConnectionFactory", () => {
    it("should create a PostgresDataSourceConnection", () => {
        const connectionString = "postgres://username:password@localhost:5432/database";
        expect(DataSourceConnectionFactory.createDataSourceConnection(connectionString)).toBeInstanceOf(PostgresDatabase);
    });

    it("should create a MysqlDataSourceConnection", () => {
        const connectionString = "mysql://username:password@localhost:3306/database";
        expect(DataSourceConnectionFactory.createDataSourceConnection(connectionString)).toBeInstanceOf(MysqlDatabase);
    });

    it("should create a MongoDataSourceConnection", () => {
        const connectionString = "mongodb+srv://username:password@cluster/database";
        expect(DataSourceConnectionFactory.createDataSourceConnection(connectionString)).toBeInstanceOf(MongoDatabase);
    });

    it("should throw an error for an invalid data source type", () => {
        const connectionString = "invalid-connection-string";
        expect(() => DataSourceConnectionFactory.createDataSourceConnection(connectionString)).toThrowError("Invalid data source type");
    });

});

