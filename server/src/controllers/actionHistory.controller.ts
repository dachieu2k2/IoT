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

        const [data] = await pool.execute('SELECT * FROM action_history LIMIT ? OFFSET ? ORDER BY ? ? WHERE MATCH(device, act) AGAINST (? IN BOOLEAN MODE)', [limit, offset, orderBy, sortBy, s])

        const [totalPage] = await pool.execute('SELECT count(*) FROM action_history')

        // const totalPage = Math.ceil(+totalPageData[0]?.count /limit)
        return {
            data,
            totalPage,
            page,
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


