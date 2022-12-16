const {MongoClient} = require('mongodb');
const users = require("../data/users");
const appointments = require("../data/appointments");
const doctors = require("../data/doctors");
const reviews = require("../data/reviews");

const connection = require('../config/mongoConnection');

async function dataFiller() {
    const db = await connection.dbConnection();
    await db.dropDatabase();


    console.log('Creating Doctors - 1');

const doctor1 = await doctors.createDoctor(
    "Kenneth",
    "Opthal",
    "MBBS,MD",
    "1111",
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
        "1111",
        "02/07/88",
        "Male",
        "Samule@yahoo.com",
        "9872785443",
        "onbusns!23U"
        );

        const doctor2 = await doctors.createDoctor(
            "JamesFank",
            "Surgeon",
            "MBBS,MD",
            "1111",
            "11/11/83",
            "Male",
            "James@yahoo.com",
            "9874564443",
            "youknowwhoitis@12Yie"
            );

            const doctor3 = await doctors.createDoctor(
                "JakeOyth",
                "Opthal",
                "MBBS,MD",
                "1111",
                "02/12/80",
                "Male",
                "123@yahoo.com",
                "9876583243",
                "qwer@12Yie"
                );

                const doctor4 = await doctors.createDoctor(
                    "KevinOntu",
                    "Physician",
                    "MBBS,MD",
                    "1111",
                    "12/07/88",
                    "Male",
                    "kevin@yahoo.com",
                    "9654364443",
                    "youknowwhoitis@12Yie"
                    );

                    const doctor6 = await doctors.createDoctor(
                        "shinchan",
                        "Physician",
                        "MBBS,MD",
                        "1111",
                        "12/06/88",
                        "Male",
                        "camren.klocko77@gmail.com",
                        "9654364442",
                        "Bunny@2799"
                        );
                        const doctor7 = await doctors.createDoctor(
                            "doremon",
                            "Physician",
                            "MBBS,MD",
                            "1111",
                            "12/10/88",
                            "Male",
                            "emmanuelle.morar@yahoo.com",
                            "9654354442",
                            "Rigup@1234"
                            );
                            const doctor8 = await doctors.createDoctor(
                                "ironman",
                                "Physician",
                                "MBBS,MD",
                                "1111",
                                "02/10/88",
                                "Male",
                                "shanel2@hotmail.com",
                                "9654454442",
                                "Rigdown@1234"
                                );
                                const doctor9 = await doctors.createDoctor(
                                    "Wonderwoman",
                                    "Physician",
                                    "MBBS,FRCS",
                                    "1111",
                                    "25/10/78",
                                    "Female",
                                    "laurie_kerluke@hotmail.com",
                                    "5514454442",
                                    "Woman@1234"
                                    );
                                    const doctor10 = await doctors.createDoctor(
                                        "CaptainMarvel",
                                        "Physician",
                                        "MBBS",
                                        "1111",
                                        "14/06/95",
                                        "Female",
                                        "meghan.legros@yahoo.com",
                                        "5514450342",
                                        "Captain@1234"
                                        );
                                        const doctor11 = await doctors.createDoctor(
                                            "Nobita",
                                            "Physician",
                                            "MBBS",
                                            "1111",
                                            "14/06/95",
                                            "Male",
                                            "walker.kling@gmail.com",
                                            "5514450342",
                                            "Puka@1234"
                                            );
                                            const doctor12 = await doctors.createDoctor(
                                                "Geon",
                                                "Neurologists",
                                                "MBBS,MD",
                                                "1111",
                                                "14/06/93",
                                                "Male",
                                                "mjoesph_kunde49@yahoo.com",
                                                "5514450332",
                                                "GGGeon@1234"
                                                );
                                                const doctor13 = await doctors.createDoctor(
                                                    "adriana",
                                                    "Neurologists",
                                                    "MBBS,MD",
                                                    "1111",
                                                    "14/08/93",
                                                    "Female",
                                                    "adriana87@gmail.com",
                                                    "5514445552",
                                                    "GGGeon@1234"
                                                    );
                                                    const doctor14 = await doctors.createDoctor(
                                                        "raina",
                                                        "Neurologists",
                                                        "MBBS,MD",
                                                        "1111",
                                                        "14/10/93",
                                                        "Male",
                                                        "raina.hackett87@hotmail.com",
                                                        "5514436152",
                                                        "GGGeon@1234"
                                                        );
                                                        const doctor15 = await doctors.createDoctor(
                                                            "ben",
                                                            "Neurologists",
                                                            "MBBS,MD",
                                                            "1111",
                                                            "15/11/93",
                                                            "Male",
                                                            "ben.dach@gmail.com",
                                                            "5514745032",
                                                            "GGGeon@1234"
                                                            );
                                                            const doctor16 = await doctors.createDoctor(
                                                                "sage",
                                                                "Pediatricians",
                                                                "MD",
                                                                "1111",
                                                                "22/05/75",
                                                                "Male",
                                                                "sage.hintz37@hotmail.com",
                                                                "5514715232",
                                                                "MMdd@1234"
                                                                );
                                                                const doctor17 = await doctors.createDoctor(
                                                                    "cummerata",
                                                                    "Pediatricians",
                                                                    "MD",
                                                                    "1111",
                                                                    "12/12/12",
                                                                    "Female",
                                                                    "marianne.cummerata54@gmail.com",
                                                                    "5156715232",
                                                                    "Cumon@1234"
                                                                    );
                                                                    const doctor18 = await doctors.createDoctor(
                                                                        "deon",
                                                                        "Pediatricians",
                                                                        "MD",
                                                                        "1111",
                                                                        "12/10/12",
                                                                        "Male",
                                                                        "deon.toy18@hotmail.com",
                                                                        "5156715200",
                                                                        "Dead@1234"
                                                                        );
                                                                        const doctor19 = await doctors.createDoctor(
                                                                            "Courtney",
                                                                            "Pediatricians",
                                                                            "MD",
                                                                            "1111",
                                                                            "06/06/02",
                                                                            "Female",
                                                                            "courtney_bogan14@hotmail.com",
                                                                            "5156715200",
                                                                            "Bangaram@1234"
                                                                            );
                                                                            const doctor20 = await doctors.createDoctor(
                                                                                "Kole",
                                                                                "Pediatricians",
                                                                                "MD",
                                                                                "1111",
                                                                                "26/06/02",
                                                                                "Male",
                                                                                "kole_littel@yahoo.com",
                                                                                "5156000200",
                                                                                "Kali@1234"
                                                                                );
                                                                                const doctor21 = await doctors.createDoctor(
                                                                                    "kassandra",
                                                                                    "Cardiologists",
                                                                                    "MBBS,MD",
                                                                                    "1111",
                                                                                    "21/06/02",
                                                                                    "Female",
                                                                                    "kassandra.nolan@gmail.com",
                                                                                    "5256000200",
                                                                                    "Neavva@1234"
                                                                                    );
                                                                                    const doctor22 = await doctors.createDoctor(
                                                                                        "Bhadra",
                                                                                        "Cardiologists",
                                                                                        "MBBS,MD",
                                                                                        "1111",
                                                                                        "21/06/02",
                                                                                        "male",
                                                                                        "brad_schoen@yahoo.com",
                                                                                        "5256000200",
                                                                                        "TrueLover@1234"
                                                                                        );
                                                                                        const doctor23 = await doctors.createDoctor(
                                                                                            "gabe",
                                                                                            "Cardiologists",
                                                                                            "MBBS,MD",
                                                                                            "1111",
                                                                                            "15/10/02",
                                                                                            "male",
                                                                                            "gabe89@hotmail.com",
                                                                                            "5256000400",
                                                                                            "TrueLofer@1234"
                                                                                            );
                                                                                            const doctor24 = await doctors.createDoctor(
                                                                                                "sam",
                                                                                                "Cardiologists",
                                                                                                "MBBS,MD",
                                                                                                "1111",
                                                                                                "12/10/02",
                                                                                                "Female",
                                                                                                "sam84@gmail.com",
                                                                                                "5256004590",
                                                                                                "Oooo@1234"
                                                                                                );
                                                                                                const doctor25 = await doctors.createDoctor(
                                                                                                    "Harvey",
                                                                                                    "Cardiologists",
                                                                                                    "MBBS,MD",
                                                                                                    "1111",
                                                                                                    "12/01/02",
                                                                                                    "Female",
                                                                                                    "harvey_ledner35@hotmail.com",
                                                                                                    "5251548590",
                                                                                                    "Olo@1234"
                                                                                                    );
                                                                                                    const doctor26 = await doctors.createDoctor(
                                                                                                        "Ova",
                                                                                                        "Anesthesiologists",
                                                                                                        "MBBS,MD",
                                                                                                        "1111",
                                                                                                        "12/05/05",
                                                                                                        "Female",
                                                                                                        "ova98@gmail.com",
                                                                                                        "521548590",
                                                                                                        "Eggo@1234"
                                                                                                        );
                                                                                                        const doctor27 = await doctors.createDoctor(
                                                                                                            "Nikolas",
                                                                                                            "Anesthesiologists",
                                                                                                            "MBBS,MD",
                                                                                                            "1111",
                                                                                                            "12/01/08",
                                                                                                            "male",
                                                                                                            "nikolas_runolfsdottir@gmail.com",
                                                                                                            "521789590",
                                                                                                            "Nikka@1234"
                                                                                                            );  const doctor28 = await doctors.createDoctor(
                                                                                                                "Lilly",
                                                                                                                "Radiologists",
                                                                                                                "MBBS,MD",
                                                                                                                "1111",
                                                                                                                "15/01/08",
                                                                                                                "Female",
                                                                                                                "lilly_swift@hotmail.com",
                                                                                                                "521789590",
                                                                                                                "Pilli@1234"
                                                                                                                );
                                                                                                                const doctor29 = await doctors.createDoctor(
                                                                                                                    "Ashley",
                                                                                                                    "Radiologists",
                                                                                                                    "MBBS,MD",
                                                                                                                    "1111",
                                                                                                                    "15/14/08",
                                                                                                                    "Female",
                                                                                                                    "ashley.nader92@hotmail.com",
                                                                                                                    "144789590",
                                                                                                                    "Sulli@1234"
                                                                                                                    );



                    console.log('Finished Creating Doctors - 1');
await connection.closeConnection();

}

dataFiller();