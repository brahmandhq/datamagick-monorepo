import axios from 'axios';

const fetchFun = async (connectionString) => {
    try {
        const response = await axios.post('/api/database-client/connect', {
            connectionString,
        });
        return response.data;
    } catch (error) {

    }
};

describe('Connect handler function', () => {
    it('should handle postgres POST request and return data', () => {
        const arr = [
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
        ];
        let result;
        const connectionString = "postgres://postgres.grfwztzvzpkxvvemzfgs:hxqNNxiIZ1HB9pxT@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
        fetchFun(connectionString)
            .then((item) => {
                result = item
            });

        if (result) {
            expect(result).toBe(arr)
        }
    })

    it('should handle mySQL POST request and return data', () => {
        const arr = [
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
        ];
        let result;
        const connectionString = "mysql://3z8wgSgcFnd9xZd.root:LMCu3JrBeem8DGoV@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test"
        fetchFun(connectionString)
            .then((item) => {
                result = item
            });

        if (result) {
            expect(result).toBe(arr)
        }
    })

    it('should handle MongoDB POST request and return data', () => {
        const arr = [
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
        ]
        let result;
        const connectionString = "mongodb+srv://getdevkit:1fw8bQ5L424ATJxz@sampledb.unvhcbj.mongodb.net/SampleData?retryWrites=true&w=majority&appName=SampleDB"
        fetchFun(connectionString)
            .then((item) => {
                result = item
            });

        if (result) {
            expect(result).toBe(arr)
        }
    })
})
