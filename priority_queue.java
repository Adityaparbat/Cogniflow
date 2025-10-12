// --- Enums ---
enum ModeIdentifier {
    DUMP,
    PASSTHROUGH,
    VALIDATE
}

enum DatabaseIdentifier {
    POSTGRES,
    REDIS,
    ELASTIC
}

// --- Supporting Classes ---
class DataPoint {
    // Represents raw or processed data
    private String data;
    
    public DataPoint(String data) {
        this.data = data;
    }

    public String getData() {
        return data;
    }
}

// --- Database Layer (Strategy Pattern) ---
interface Database {
    void connect();
    void insert(DataPoint data);
    void validate(DataPoint data);
}

class PostgresDatabase implements Database {
    public void connect() { /* connect to Postgres */ }
    public void insert(DataPoint data) { /* insert into Postgres */ }
    public void validate(DataPoint data) { /* validate with Postgres */ }
}

class RedisDatabase implements Database {
    public void connect() { /* connect to Redis */ }
    public void insert(DataPoint data) { /* insert into Redis */ }
    public void validate(DataPoint data) { /* validate with Redis */ }
}

class ElasticDatabase implements Database {
    public void connect() { /* connect to Elastic */ }
    public void insert(DataPoint data) { /* insert into Elastic */ }
    public void validate(DataPoint data) { /* validate with Elastic */ }
}

// --- Mode Layer (State Pattern) ---
interface ProcessingMode {
    void process(DataPoint data);
}

class DumpMode implements ProcessingMode {
    public void process(DataPoint data) {
        // Simply drops data
    }
}

class PassthroughMode implements ProcessingMode {
    private Database database;

    public PassthroughMode(Database db) {
        this.database = db;
    }

    public void process(DataPoint data) {
        database.insert(data);
    }
}

class ValidateMode implements ProcessingMode {
    private Database database;

    public ValidateMode(Database db) {
        this.database = db;
    }

    public void process(DataPoint data) {
        database.validate(data);
        database.insert(data);
    }
}

// --- Core Processor (Context Class) ---
class DataProcessor {
    private ProcessingMode mode;
    private Database database;

    public void configure(ModeIdentifier modeId, DatabaseIdentifier dbId) {
        // Select Database
        switch (dbId) {
            case POSTGRES -> database = new PostgresDatabase();
            case REDIS -> database = new RedisDatabase();
            case ELASTIC -> database = new ElasticDatabase();
        }
        database.connect();

        // Select Mode
        switch (modeId) {
            case DUMP -> mode = new DumpMode();
            case PASSTHROUGH -> mode = new PassthroughMode(database);
            case VALIDATE -> mode = new ValidateMode(database);
        }
    }

    public void process(DataPoint data) {
        if (mode != null) {
            mode.process(data);
        } else {
            throw new IllegalStateException("Processor not configured.");
        }
    }
}
