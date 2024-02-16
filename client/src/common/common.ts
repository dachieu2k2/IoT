

export enum OrderEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}
export enum OrderByEnum {
    CREATE_AT = 'createAt',
    ID = 'id',
    TEMPERATURE = 'temperature',
    HUMIDITY = 'humidity',
    LIGHT = 'light',
    ACTION = 'action',

}

export type DefaultParams = {
    page?: number
    limit?: number
    order?: OrderEnum
    s?: string
    orderBy?: OrderByEnum | React.Key | string
}

