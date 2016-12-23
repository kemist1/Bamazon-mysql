var mysql        = require('mysql');
var prompt       = require('prompt');


var connection   = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password:"Chemist1ism",
    database: "bamazon"
});
//initiates the connection that we created earlier
connection.connect(function(err){
	// if there is an error log it
	if(err){
		console.error("error connecting: " + err.stack);
		return;
	}
	// if not error console.log connected
	console.log('connected as id' + connection.threadID);
});


//shows all the products
connection.query('SELECT * FROM Products', function(err, res){

	// if error throw error.
	if(err) {
		throw err;
	}
	// print out contents of the response
	console.log(res);
	
});

//creating a constructor
var Order = function(table,Item,Quantity){
	this.table= table;
	this.Item = Item;
	this.Quantity= Quantity;

	}
//starting prompt
prompt.start();
prompt.get(['table','Item','Quantity'],function(err,result){

	var order = new Order(result.table,result.Item,result.Quantity)
//---------------------------------------------------------------
//shows selected product name
   var orderID = order.Item;
   var sql = 'SELECT * FROM ?? WHERE ?? = ?';
   var inserts = ['Products','ID',orderID];
   sql = mysql.format(sql,inserts);

connection.query(sql,function(err, res){

	if(err){
		throw err;
	}
	console.log(res);
	console.log(res[0].ProductName);
});

//--------------------------------------------------------------
//shows selected product quantity
  var orderQuantity = order.Quantity;
  var sql1 = 'SELECT * FROM ?? WHERE ?? > ?';
  var inserts1 = ['Products','StockQuantity',orderQuantity];
  sql1 = mysql.format(sql1,inserts1);

  connection.query(sql1,function(err, res){

  	if(err){
  		throw err;
  	}
  	
  	//console.log(res[0].StockQuantity);
  	var placeOrder = res[0].StockQuantity;
  	if(placeOrder > orderQuantity){
  		console.log("Your order has been placed");
  	}
  	else{
  		console.log("Not in stock");
  	};

  });
//----------------------------------------------------------------
//calculating total cost
var sql2 = 'SELECT Price FROM ?? WHERE ?? = ?';
var inserts2 = ['Products','ID',orderID];
sql2 = mysql.format(sql2,inserts2);

connection.query(sql2,function(err,res){

	if(err){
		throw err;
	}
	//console.log(res[0].Price);
	var price = (res[0].Price) * orderQuantity;
	console.log(price);
});
//----------------------------------------------------------------
//update stock in table
var sql3 = 'UPDATE ?? SET ?? = ?? - ? WHERE ?? = ?';
var inserts3 = ['Products','StockQuantity','StockQuantity',orderQuantity,'ID',orderID];
sql3 = mysql.format(sql3,inserts3);
 
connection.query(sql3,function(err,res){

	if(err){
		throw err;
     }
    
     //console.log(res[0]);

});
 

});