import { DataSensors } from "~/models/dataSensors.model"
import { pool } from "~/db/connectDB";
import { IParams } from "~/common";


export const saveDataSensor = async (dataSensor: DataSensors) => {
    await pool.query(
        "INSERT INTO data_sensor (temperature, humidity, light) VALUES(?,?,?)",
        [dataSensor.temperature, dataSensor.humidity, dataSensor.light])
}

// pagination/ sort/ search/ filter?
export const getDataSensors = async ({ page, limit, orderBy, sortBy, s }: IParams) => {
    try {

        const offset = (page - 1) * limit

        let query = 'SELECT * FROM data_sensor'

        if (s) {
            query += ` WHERE MATCH(temperature, humidity, light) AGAINST (${s} IN BOOLEAN MODE)`
        }


        if (orderBy) {
            // query += ' ORDER BY ? ?'
            query += ` ORDER BY ${orderBy} ${sortBy}`
        }


        if (limit && page) {
            query += ` LIMIT ${+limit} OFFSET ${+offset}`
        }

        console.log(query);




        // console.log(offset);


        // const [data] = await pool.execute('SELECT * FROM data_sensor LIMIT ? OFFSET ? ORDER BY ? ? WHERE MATCH(temperature, humidity, light) AGAINST (? IN BOOLEAN MODE)', [limit, offset, orderBy, sortBy, s])
        const [data] = await pool.execute(query)


        const [totalPageData] = await pool.execute('SELECT count(*) FROM data_sensor')
        console.log(totalPageData);


        const totalPage = +limit === 0 ? 1 : Math.ceil(+(totalPageData as unknown as any)[0]?.['count(*)'] / limit)

        // console.log({
        //     data,
        //     totalPage,
        //     page,
        //     limit,
        //     orderBy,
        //     sortBy,
        //     s
        // });

        return {
            data,
            totalPage,
            total: +(totalPageData as unknown as any)[0]?.['count(*)'],
            page: +limit === 0 ? 1 : page,
            limit,
            orderBy,
            sortBy,
            s
        }
    } catch (error) {
        console.log(error);

    }
}

export const getDataSensorsById = async (dataSensorsId: number) => {
    try {
        const [dataSensor] = await pool.execute(
            "SELECT * FROM data_sensor WHERE id = ?",
            [dataSensorsId])

        return dataSensor
    } catch (error) {
        console.log(error);
    }

}

export const updateDataSensors = async (dataSensors: DataSensors) => {
    try {
        await pool.query(
            "UPDATE data_sensor SET temperature = ?, humidity = ?, light = ? WHERE id = ?",
            [dataSensors.temperature, dataSensors.humidity, dataSensors.light, dataSensors.id])
    } catch (error) {
        console.log(error);

    }
}

export const deleteDataSensor = async (dataSensorsId: number) => {
    try {
        await pool.query(
            "DELETE FROM data_sensor WHERE id = ?",
            [dataSensorsId])
    } catch (error) {
        console.log(error);

    }

}

export const deleteAllDataSensors = async () => {
    try {
        await pool.query("DELETE FROM data_sensor")

    } catch (error) {
        console.log(error);
    }
}


