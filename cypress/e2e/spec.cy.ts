import {IOmdbResponse} from "../../src/ts/models/IOmdbResponse";
import { IMovie } from "../../src/ts/models/Movie";

let testData:IOmdbResponse = {Search:[    
  {Title:"Harry Potter 1", imdbID:"1091", Type:"movie",Poster:"url1", Year:"2001"},
  {Title:"Harry Potter 2", imdbID:"1092", Type:"movie",Poster:"url2", Year:"2002"},
  {Title:"Harry Potter 3", imdbID:"1093", Type:"movie",Poster:"url3", Year:"2003"}
]};

describe("should test todo app", () => {
  it("should find button", () => {
    cy.visit("http://localhost:1234");
    cy.get("button").contains("Sök");
  });

  it("should be able to click", () => {
    cy.visit("http://localhost:1234");
    cy.get("button").contains("Sök");
    cy.get("button").click();
  })

  /*it("should submit form", ()=>{
    cy.visit("http://localhost:1234");
    cy.get("#searchForm").submit();
  })*/

  it("should be able to type", ()=>{
    cy.visit("http://localhost:1234");
    cy.get("input").type("Harry").should("have.value", "Harry");
  });

  it("should display HTML", ()=> {
    cy.visit("http://localhost:1234");
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.get("div > h3:first").contains("Harry Potter");
  })

  /*it("should be able to display errormessage when no input", ()=> {
    cy.visit("http://localhost:1234");
    cy.get("input").clear();
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa")
  })*/

  it("should be able to display errormessage when no movie matches search submitted by user", ()=> {
    cy.visit("http://localhost:1234");
    cy.get("input").type("asdfghj").should("have.value", "asdfghj");
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.get("div > p").contains("Inga sökresultat att visa")
  })

  //submit??

});


describe("should handle API", () => {

  /*it("no input should recieve 0 movies", ()=> {
    cy.visit("http://localhost:1234");
    cy.get("input").clear();
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.get("div#movie-container").contains("have.length", 0);
  })*/

  it("should get 10 divs from API-get", () => {
    cy.visit("http://localhost:1234");
    cy.intercept("GET","http://omdbapi.com/*").as ("movies");
    cy.get("input").type("Harry").should("have.value", "Harry");
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.wait("@movies").its("request.url").should("contain", "s=Harry");
    cy.get("div#movie-container > div").should("have.length", 10);
  })

  it("should be able to display errormessage when no input from user", ()=> {
    cy.visit("http://localhost:1234");
    cy.get("input").clear();
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa")
  })

  it("should fetch testData", () => {
    //cy.visit("http://localhost:1234");
    cy.intercept("GET","http://omdbapi.com/*",testData).as ("movies");
    cy.get("input").type("Harry").should("have.value", "Harry");
    cy.get("button").contains("Sök");
    cy.get("button").click();
    cy.wait("@movies").its("request.url").should("contain", "Harry");
    //cy.get("div").should("have.id", "movie-container");
    //cy.wait("@movies").its("request.url").should("contain", "Harry");
  });
  
  it("should get three h3 headings", () => {
    cy.visit("http://localhost:1234");
    cy.intercept("GET", "http://omdbapi.com/*", testData);
    cy.get("form").submit();
    cy.get("div.movie > h3").should("have.length", 3);
  });

  /*it.("should get three imgages", () => {
    cy.visit("http://localhost:1234");
    cy.intercept("GET", "http://omdbapi.com/*", testData);

    cy.get("form").submit();

    cy.get("div.movie > img").should("have.length", 3);
  });*/

//Testa när vi får status ej ok från api fetch??

});