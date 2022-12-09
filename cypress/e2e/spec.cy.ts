import {IOmdbResponse} from "../../src/ts/models/IOmdbResponse";

let testData:IOmdbResponse = {Search:[    
  {Title: "Harry Potter and the Deathly Hallows: Part 2", Year: "2011", imdbID: "tt1201607", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Sorcerer's Stone", Year: "2001", imdbID: "tt0241527", Type: "movie", Poster: "https://m.media-amazon.com/images/I/51asM9eJMXL.jpg"}, 
  {Title: "Harry Potter and the Chamber of Secrets", Year: "2002", imdbID: "tt0295297", Type: "movie", Poster: "https://m.media-amazon.com/images/I/51lXKcsxWML._AC_.jpg"},
  {Title: "Harry Potter and the Prisoner of Azkaban", Year: "2004", imdbID: "tt0304141", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTY4NTIwODg0N15BMl5BanBnXkFtZTcwOTc0MjEzMw@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Goblet of Fire", Year: "2005", imdbID: "tt0330373", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTI1NDMyMjExOF5BMl5BanBnXkFtZTcwOTc4MjQzMQ@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Order of the Phoenix", Year: "2007", imdbID: "tt0373889", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTM0NTczMTUzOV5BMl5BanBnXkFtZTYwMzIxNTg3._V1_SX300.jpg"},
  {Title: "Harry Potter and the Deathly Hallows: Part 1", Year: "2010", imdbID: "tt0926084", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTQ2OTE1Mjk0N15BMl5BanBnXkFtZTcwODE3MDAwNA@@._V1_SX300.jpg"},
  {Title: "Harry Potter and the Half-Blood Prince", Year: "2009", imdbID: "tt0417741", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@._V1_SX300.jpg"},
  {Title: "When Harry Met Sally...", Year: "1989", imdbID: "tt0098635", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMjE0ODEwNjM2NF5BMl5BanBnXkFtZTcwMjU2Mzg3NA@@._V1_SX300.jpg"},
  {Title: "Dirty Harry", Year: "1971", imdbID: "tt0066999", Type: "movie", Poster: "	https://media.posterlounge.com/img/products/360000/350932/350932_poster_l.jpg"}
]};


beforeEach(()=>{
  cy.visit("/");
});

afterEach(()=>{
  cy.reload();
});

  describe("should test todo app", () => {
    it("should find button", () => { 
      cy.get("button").contains("Sök");
    });
  
    it("should be able to click", () => {
      cy.get("button").contains("Sök");
      cy.get("button").click();
    })

    it("should show form", () => {
      cy.get("form").should("have.id", "searchForm")
    })
  
    it("should submit form", ()=>{
      cy.visit("http://localhost:1234");
      cy.get("#searchForm").submit();
    })
  
    it("should be able to type", ()=>{
      cy.get("input").type("Harry").should("have.value", "Harry");
    });
  
    it("should be able to display errormessage when no movie matches search submitted by user", ()=> {
      cy.get("input").type("asdfghj").should("have.value", "asdfghj");
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.get("div > p").contains("Inga sökresultat att visa");
    })

    it("should validate the form", () =>{
      cy.get("form").submit();
      cy.get("input:invalid").should("have.length", 0);
      cy.get("div > p").contains("Inga sökresultat att visa");
    })
  });
  
  
  describe("should handle API", () => {
  
    it("should get 10 divs from API-get", () => {
      cy.intercept("GET","http://omdbapi.com/*").as ("movies");
      cy.get("input").type("Harry").should("have.value", "Harry");
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.wait("@movies").its("request.url").should("contain", "s=Harry");
      cy.get("div#movie-container > div").should("have.length", 10);
    })
  
    it("should be able to display errormessage when no input from user", ()=> {
      cy.get("input").clear();
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.get("p").contains("Inga sökresultat att visa")
    })
  
    it("should fetch testData", () => {
      cy.intercept("GET","http://omdbapi.com/*",testData).as ("movies");
      cy.get("input").type("Harry").should("have.value", "Harry");
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.wait("@movies").its("request.url").should("contain", "Harry");
    });
    
    it("should get 10 h3 headings, images, image-attrs", () => {
      cy.intercept("GET", "http://omdbapi.com/*", testData);
      cy.get("form").submit();
      cy.get("div.movie > img").should("have.length", 10);
      cy.get("div.movie > h3").should("have.length", 10);
      cy.get("img").should("have.attr", "src");
      cy.get("img").should("have.attr", "alt");
    });

    it("should get no results", () => {
      cy.intercept("GET", "http://omdbapi.com/*", {});
      cy.get("button").contains("Sök");
      cy.get("button").click();
      cy.get("div#movie-container > div").should("have.length", 0);
    });

    it("should get errormsg404", () => {
      cy.request({
      method: "GET",
      url: "http://omdbapi.com/?apikey=416ed51a&s=%",
      failOnStatusCode: false,    
    }).as("error");
    cy.get("@error").its("status").should("equal", 404);
    });
  });
