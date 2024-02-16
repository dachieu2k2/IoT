export enum SortByEnum {
    ASC = 'ASC',
    DESC = 'DESC'
}

export interface IParams {
    page: number
    limit: number
    orderBy: string
    sortBy: string
    s?: string
}
