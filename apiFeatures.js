class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};

    //console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this; //that means this class will return
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    //console.log(queryCopy)
    //Removing some fields for category

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    //console.log(queryCopy)

    //Filter for price and rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    //console.log(queryStr);
    return this; //this.query means product.find(method)
  }


    //for Pagination

    pagination(resultPerPage){
        const currentPage= Number(this.queryStr.page) || 1   

          console.log(currentPage);
        const skip=resultPerPage * (currentPage-1);

        console.log(skip);
        this.query=this.query.limit(resultPerPage).skip(skip);
        
        return this;
    }

}

module.exports = ApiFeatures;

//this is only to find keyword if we give localhost:8000/api/vi/product/galaxy it
//will print all data that contain word galaxy

//http://localhost:8000/api/v1/products?keyword=product1&category=Laptop
//here keyword using search method and category,price,rating using filter
//querystr means things we write in url eyword=product1&category=Laptop,price(all)


//pagination logic

//suppose we have 50 products we have to  and resultperpage is 10 that means
//we have to show 10 products on each page so we required 5 pages
//resultPerPage * (currentPage-1)
//skip=10 *(1-1)=0   it will show first page without skipping any product
//on second page we have to show suppose 11- 20 that means we have to skip first page
//or simply we can say 10 products
//skip=10*(2-1)=10 // again it will show 10 products (11-20)
//next 21-30 so we have to skip first 20
//skip=10*(3-1)=20;
//next 30-40 30 pages should be skip

//skip=10*(4-1)=10*3=30
//41-50
//skip=10*(5-1)=10*4=40


//http://localhost:8000/api/v1/products?page=2 in postman(for pagination)