const {MongoClient} = require('mongodb');
const users = require("../data/users");
const appointments = require("../data/appointments");
const doctors = require("../data/doctors");
const reviews = require("../data/reviews");

const connection = require('../config/mongoConnection');

async function dataFiller() {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    // await connection.closeConnection();

    console.log('Creating User - 1');

const doctor1 = await doctors.createDoctor(
    "Kenneth",
    "Opthal",
    "MBBS,MD",
    "123456",
    "12/12/88",
    "Male",
    "Kenneth@yahoo.com",
    "9876564443",
    "sdjfbwefj@1Rywb"
    );

    const doctor5 = await doctors.createDoctor(
        "Samule",
        "Cardi",
        "MBBS,MD",
        "876543",
        "02/07/88",
        "Male",
        "Samule@yahoo.com",
        "9872785443",
        "onbusns!23U"
        );

        const doctor2 = await doctors.createDoctor(
            "James Fank",
            "Surgeon",
            "MBBS,MD",
            "098787",
            "11/11/83",
            "Male",
            "James@yahoo.com",
            "9874564443",
            "youknowwhoitis@12Yie"
            );

            const doctor3 = await doctors.createDoctor(
                "Jake Oyth",
                "Opthal",
                "MBBS,MD",
                "914567",
                "02/12/80",
                "Male",
                "Kenneth@yahoo.com",
                "9876583243",
                "qwer@12Yie"
                );

                const doctor4 = await doctors.createDoctor(
                    "Kevin Ontu",
                    "Physician",
                    "MBBS,MD",
                    "563213",
                    "12/07/88",
                    "Male",
                    "kevin@yahoo.com",
                    "9654364443",
                    "youknowwhoitis@12Yie"
                    );
}

dataFiller();