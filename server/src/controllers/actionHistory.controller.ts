import { ActionHistory } from "~/models/actionHistory.model"
import { pool } from "~/db/connectDB";
import { IParams } from "~/common";


export const saveActionHistory = async (actionHistory: ActionHistory) => {
    await pool.query(
        "INSERT INTO action_history (device, act) VALUES(?,?)",
        [actionHistory.device, actionHistory.act])
}

// pagination/ sort/ search/ filter?
export const getActionHistorys = async ({ page, limit, orderBy, sortBy, s }: IParams) => {
    try {

        const offset = (page - 1) * limit

        let query = 'SELECT * FROM action_history'

        if (s) {
            query += ` WHERE MATCH(device, act) AGAINST (${s} IN BOOLEAN MODE)`
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


        const [totalPageData] = await pool.execute('SELECT count(*) FROM action_history')
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

export const getActionHistoryById = async (actionHistoryId: number) => {
    try {
        const [actionHistory] = await pool.execute(
            "SELECT * FROM action_history WHERE id = ?",
            [actionHistoryId])

        return actionHistory
    } catch (error) {
        console.log(error);
    }

}

export const updateActionHistory = async (actionHistory: ActionHistory) => {
    try {
        await pool.query(
            "UPDATE action_history SET device = ?, act = ? WHERE id = ?",
            [actionHistory.device, actionHistory.act, actionHistory.id])
    } catch (error) {
        console.log(error);

    }
}

export const deleteActionHistory = async (actionHistoryId: number) => {
    try {
        await pool.query(
            "DELETE FROM action_history WHERE id = ?",
            [actionHistoryId])
    } catch (error) {
        console.log(error);

    }

}

export const deleteAllActionHistory = async () => {
    try {
        await pool.query("DELETE FROM action_history")

    } catch (error) {
        console.log(error);
    }
}


