import { useEffect, useRef, useState } from "react";
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = (pharmacyname: string) => {
  const db = useRef<SQLiteDBConnection | undefined>(undefined);
  const sqlite = useRef<SQLiteConnection | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      try {
        const ret = await sqlite.current.checkConnectionsConsistency();
        const isConn = (await sqlite.current.isConnection(pharmacyname, false)).result;

        if (ret.result && isConn) {
          db.current = await sqlite.current.retrieveConnection(pharmacyname, false);
        } else {
          db.current = await sqlite.current.createConnection(
            pharmacyname,
            false,
            "no-encryption",
            1,
            false
          );
        }

        await initializeTables();
        setInitialized(true);
      } catch (error) {
        console.error("Error initializing the database", error);
        setInitialized(false);
      }
    };

    initializeDB();

    // Cleanup function to close the database connection on unmount
    return () => {
      const closeConnection = async () => {
        if (db.current) {
          try {
            await db.current.close();
          } catch (closeError) {
            console.error("Error closing the database connection", closeError);
          }
        }
      };
      closeConnection();
    };
  }, [pharmacyname]);

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    successCallback?: () => void,
    errorCallback?: (error: Error) => void
  ) => {
    try {
      if (!db.current) {
        console.error("Database connection is not available");
        return;
      }
      
      await db.current.open();
      await action(db.current);
      if (successCallback) successCallback();
    } catch (error) {
      console.error("Error during SQL action", error);
      if (errorCallback) errorCallback(error as Error);
    } finally {
      try {
        await db.current?.close();
      } catch (closeError) {
        console.error("Error closing the database", closeError);
      }
    }
  };

  const initializeTables = async () => {
    await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      const queryCreateMedicinesTable = `
        CREATE TABLE IF NOT EXISTS medicines_${pharmacyname} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          type TEXT,
          quantity TEXT,
          expiry_date TEXT,
          batch_no TEXT,
          price REAL,
          UNIQUE (name, expiry_date, batch_no)
        );
      `;

      const queryCreateGeneralItemsTable = `
        CREATE TABLE IF NOT EXISTS general_items_${pharmacyname} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          quantity TEXT,
          expiry_date TEXT,
          batch_no TEXT,
          price REAL,
          UNIQUE (name, expiry_date, batch_no)
        );
      `;

      const queryCreateUserTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pharmacy_name TEXT,
          email TEXT UNIQUE,
          phone_number TEXT UNIQUE,
          password TEXT
        );
      `;

      await db?.execute(queryCreateMedicinesTable);
      await db?.execute(queryCreateGeneralItemsTable);
      await db?.execute(queryCreateUserTable);

      console.log("Tables created successfully.");
    });
  };

  const checkForDuplicate = async (
    table: string,
    name: string,
    expiryDate: string,
    batchNo: string
  ): Promise<boolean> => {
    const query = `
      SELECT COUNT(*) AS count
      FROM ${table}
      WHERE name = ? AND expiry_date = ? AND batch_no = ?
    `;
    const result = await db.current?.query(query, [name, expiryDate, batchNo]);

    // Use optional chaining and nullish coalescing to safely access values
    const count = result?.values?.[0]?.count ?? 0;
    return count > 0;
  };

  const addMedicine = async (
    name: string,
    type: string,
    quantity: string,
    expiryDate: string,
    batchNo: string,
    price: number,
    successCallback?: () => void,
    errorCallback?: (error: Error) => void
  ) => {
    await performSQLAction(async (db) => {
      const duplicateExists = await checkForDuplicate(
        `medicines_${pharmacyname}`,
        name,
        expiryDate,
        batchNo
      );

      if (duplicateExists) {
        throw new Error('Medicine with the same name, expiry date, and batch number already exists.');
      }

      const query = `
        INSERT INTO medicines_${pharmacyname} (name, type, quantity, expiry_date, batch_no, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db?.run(query, [name, type, quantity, expiryDate, batchNo, price]);
    }, successCallback, errorCallback);
  };

  const addGeneralItem = async (
    name: string,
    quantity: string,
    expiryDate: string,
    batchNo: string,
    price: number,
    successCallback?: () => void,
    errorCallback?: (error: Error) => void
  ) => {
    await performSQLAction(async (db) => {
      const duplicateExists = await checkForDuplicate(
        `general_items_${pharmacyname}`,
        name,
        expiryDate,
        batchNo
      );

      if (duplicateExists) {
        throw new Error('General item with the same name, expiry date, and batch number already exists.');
      }

      const query = `
        INSERT INTO general_items_${pharmacyname} (name, quantity, expiry_date, batch_no, price)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db?.run(query, [name, quantity, expiryDate, batchNo, price]);
    }, successCallback, errorCallback);
  };

  const registerUser = async (
    pharmacyName: string,
    email: string,
    phoneNumber: string,
    password: string,
    successCallback?: () => void,
    errorCallback?: (error: Error) => void
  ) => {
    await performSQLAction(async (db) => {
      const query = `
        INSERT INTO users (pharmacy_name, email, phone_number, password)
        VALUES (?, ?, ?, ?)
      `;
      await db?.run(query, [pharmacyName, email, phoneNumber, password]);
    }, successCallback, errorCallback);
  };

  const validateLogin = async (
    emailOrPhone: string,
    password: string,
    successCallback?: (pharmacyName: string) => void,
    errorCallback?: (error: Error) => void
  ) => {
    await performSQLAction(async (db) => {
      const query = `
        SELECT pharmacy_name FROM users
        WHERE (email = ? OR phone_number = ?) AND password = ?
      `;
      const result = await db?.query(query, [emailOrPhone, emailOrPhone, password]);

      // Use optional chaining and nullish coalescing to safely access values
      const values = result?.values ?? [];

      if (values.length) {
        const pharmacyName = values[0].pharmacy_name;
        if (successCallback) successCallback(pharmacyName);
      } else {
        if (errorCallback) errorCallback(new Error('Invalid email/phone number or password.'));
      }
    }, undefined, errorCallback);
  };

  return { performSQLAction, initialized, addMedicine, addGeneralItem, registerUser, validateLogin };
};

export default useSQLiteDB;
