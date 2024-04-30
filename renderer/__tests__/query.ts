import axios from 'axios';

const fetchFun = async (connectionString, query) => {
    try {
        const response = await axios.post('/api/database-client/query', {
            connectionString,
            query
        });
        return response.data;
    } catch (error) {

    }
};

describe('query handler function', () => {
    it('should handle postgres POST request and return data', () => {
        const arr = [
            {
                "id": "1",
                "name": "Alice",
                "age": 25,
                "email": "alice@example.com"
            },
            {
                "id": "2",
                "name": "Bob",
                "age": 30,
                "email": "bob@example.com"
            },
            {
                "id": "3",
                "name": "Charlie",
                "age": 35,
                "email": "charlie@example.com"
            },
            {
                "id": "4",
                "name": "David",
                "age": 40,
                "email": "david@example.com"
            },
            {
                "id": "5",
                "name": "Eve",
                "age": 45,
                "email": "eve@example.com"
            },
            {
                "id": "6",
                "name": "Frank",
                "age": 50,
                "email": "frank@example.com"
            },
            {
                "id": "7",
                "name": "Grace",
                "age": 55,
                "email": "grace@example.com"
            },
            {
                "id": "8",
                "name": "Henry",
                "age": 60,
                "email": "henry@example.com"
            },
            {
                "id": "9",
                "name": "Ivy",
                "age": 65,
                "email": "ivy@example.com"
            },
            {
                "id": "10",
                "name": "Jack",
                "age": 70,
                "email": "jack@example.com"
            },
            {
                "id": "11",
                "name": "Kate",
                "age": 75,
                "email": "kate@example.com"
            },
            {
                "id": "12",
                "name": "Liam",
                "age": 80,
                "email": "liam@example.com"
            },
            {
                "id": "13",
                "name": "Mia",
                "age": 85,
                "email": "mia@example.com"
            },
            {
                "id": "14",
                "name": "Noah",
                "age": 90,
                "email": "noah@example.com"
            },
            {
                "id": "15",
                "name": "Olivia",
                "age": 95,
                "email": "olivia@example.com"
            },
            {
                "id": "16",
                "name": "Peter",
                "age": 100,
                "email": "peter@example.com"
            },
            {
                "id": "17",
                "name": "Quinn",
                "age": 105,
                "email": "quinn@example.com"
            },
            {
                "id": "18",
                "name": "Ryan",
                "age": 110,
                "email": "ryan@example.com"
            },
            {
                "id": "19",
                "name": "Sara",
                "age": 115,
                "email": "sara@example.com"
            },
            {
                "id": "20",
                "name": "Tom",
                "age": 120,
                "email": "tom@example.com"
            }
        ];
        const connectionString = "postgres://postgres.grfwztzvzpkxvvemzfgs:hxqNNxiIZ1HB9pxT@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
        const query = 'SELECT * FROM \"sample_table\";'
        let result;
        fetchFun(connectionString, query)
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
                "id": 1,
                "name": "John Doe",
                "city": "New York",
                "number": "1234567890"
            },
            {
                "id": 2,
                "name": "Jane Smith",
                "city": "Los Angeles",
                "number": "9876543210"
            },
            {
                "id": 3,
                "name": "Michael Johnson",
                "city": "Chicago",
                "number": "2468135790"
            },
            {
                "id": 4,
                "name": "Emily Brown",
                "city": "Houston",
                "number": "1357924680"
            },
            {
                "id": 5,
                "name": "David Wilson",
                "city": "Phoenix",
                "number": "3692581470"
            }
        ];
        const connectionString = "mysql://3z8wgSgcFnd9xZd.root:LMCu3JrBeem8DGoV@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test"
        const query = 'SELECT * FROM \"user\";'
        let result;
        fetchFun(connectionString, query)
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
                "_id": "65f138b037811ae57c2e9642",
                "username": "john_doe",
                "email": "john@example.com",
                "age": 30,
                "address": {
                    "city": "New York",
                    "country": "USA"
                },
                "isActive": true
            },
            {
                "_id": "65f1394637811ae57c2e9643",
                "username": "jane_smith",
                "email": "jane@example.com",
                "age": 25,
                "address": {
                    "city": "Los Angeles",
                    "country": "USA"
                },
                "isActive": false
            },
            {
                "_id": "65f1396737811ae57c2e9644",
                "username": "alice_miller",
                "email": "alice@example.com",
                "age": 35,
                "address": {
                    "city": "Chicago",
                    "country": "USA"
                },
                "isActive": true
            },
            {
                "_id": "65f1397c37811ae57c2e9645",
                "username": "bob_johnson",
                "email": "bob@example.com",
                "age": 28,
                "address": {
                    "city": "Houston",
                    "country": "USA"
                },
                "isActive": true
            },
            {
                "_id": "65f1399337811ae57c2e9646",
                "username": "emily_brown",
                "email": "emily@example.com",
                "age": 40,
                "address": {
                    "city": "San Francisco",
                    "country": "USA"
                },
                "isActive": false
            }
        ]
        const connectionString = "mongodb+srv://getdevkit:1fw8bQ5L424ATJxz@sampledb.unvhcbj.mongodb.net/SampleData?retryWrites=true&w=majority&appName=SampleDB"
        const query = 'db.collection(\"userData\").find().toArray()'
        let result;
        fetchFun(connectionString, query)
            .then((item) => {
                result = item
            });

        if (result) {
            expect(result).toBe(arr)
        }
    })
})