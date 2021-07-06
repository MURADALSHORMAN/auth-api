const {server} = require('../../src/server');
const supertest = require('supertest');
const mockRequest = supertest(server);

describe('api server',()=>{
  
  it('Should return status 404',async ()=>{
  
  const response = await mockRequest.post(`/food`).send({food:{
      
    name: "String",
    calories: 10,
    type: "FRUIT",
    
}});
  id=response.body._id
  console.log(id)
    const res = await mockRequest.get(`/api/v1`);
    expect(res.status).toBe(404);
 
  });



 

  it('Should return 404 for delete',async ()=>{
    
    const response = await mockRequest.delete(`/api/v1/food`,{food:{
      
      name: "String",
      calories: 10,
      type: "FRUIT"
      
  }});

 expect(response.status).toBe(404);
  });



  it('handels bad requstes',async()=>{
    const response= await mockRequest.get('/fos');
    
    expect(response.status).toBe(404);

});

it('handels errors',async()=>{
    const response=await mockRequest.get('/bad');
    expect(response.status).toEqual(404);
});


})