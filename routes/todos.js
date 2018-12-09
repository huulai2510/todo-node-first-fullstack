const express = require('express');
const router = express.Router();
const fs = require('fs');

let todos = require('./todolist.json');

/* GET todos listing. */
router.get('/', function(req, res, next) {
  let list = [];
  let { pageId, row } = req.query;
  let idxStart = (Number(pageId) - 1)*Number(row);
  for(let i = idxStart; i < idxStart + Number(row) ; i ++) {
    if(todos[i]) {
      list.push(todos[i]);
    }
  }
   let resData = {
    todos: list,
    row: Number(row),
    pageId: Number(pageId),
    total: todos.length
  }
  res.send(resData);
});

/* POST todos listing. */
router.post('/', function(req, res, next) {
  if(!req.body.id) {
    req.body.id = Math.floor(Math.random() * 1000);
    let data = todos.concat(req.body);
    fs.writeFileSync(__dirname + "/todolist.json", JSON.stringify(data));
    res.send("create todo success!");
  } else {
    let idx = todos.findIndex(item => item.id === req.body.id);
    if(idx === -1) {
      res.send("todo not found!");
    } else {
      let data = todos;
      for(keys in req.body) {
        data[idx][keys] = req.body[keys];
      };
      fs.writeFileSync(__dirname + "/todolist.json", JSON.stringify(data));
      res.send("edit success!");
    }
  }
});

/* DELETE todos listing. */
router.delete('/:id', function(req, res, next) {
  let idx = todos.findIndex(item => item.id === Number(req.params.id));
  todos.splice(idx, 1);
  fs.writeFileSync(__dirname + "/todolist.json", JSON.stringify(todos));
  res.send("delete success!");
});

/* PUT todos listing. */
router.put('/:id', function(req, res, next) {
  let idx = todos.findIndex(item => item.id === Number(req.params.id));
  todos[idx] = req.body;
  fs.writeFileSync(__dirname + "/todolist.json", JSON.stringify(todos));
  res.send("edit success!");
});

module.exports = router;