// put.js

var update = document.getElementById('update');

update.addEventListener('click', () => {
	// PUT request goes here
	console.log("PUT requested");

	fetch('updateitem', {
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({title: 'Updated Title'})
	})
	.then((res) => { // fetch returns promise--check promise 
		if (res.ok) return res.json();
	})
	.then((data) => {
		console.log(data); 
		window.location.reload(true); 
	});

});

var del = document.getElementById('delete');

del.addEventListener('click', () => {
	console.log("delete");

	fetch('deleteitem', {
		method: 'delete',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({title: 'Updated Title'})
	})
	.then((res) => { // fetch returns promise--check promise 
		if (res.ok) return res.json();
		console.log('res promise'); 
	})
	.then((data) => {
		console.log(data); 
		window.location.reload(true); 
	});
});