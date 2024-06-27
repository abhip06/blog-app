import mongoose from "mongoose";

export class ApiFeatures {

    public query: any;
    public queryString: any;

    constructor(query: any, queryString: any){
        this.query = query;
        this.queryString = queryString;
    }

    // Search function
    async search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: "i",
            },
        } : {};

        this.query = await this.query.find({ ...keyword });
        return this;
    }

    // Filter function
    async filter() {
        const queryCopy = {...this.queryString};

        // Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key => delete queryCopy[key]);

        // Filter for Price and Rating
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = await this.query.find(JSON.parse(queryString));
        return this;
    }

    // Pagination function
    async pagination(resultPerPage: number) {
        const currentPage: number = Number(this.queryString?.page) || 1;

        const skip: number = resultPerPage * (currentPage - 1);
        this.query = await this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}