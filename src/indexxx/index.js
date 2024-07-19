fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json', {
    mode: 'no-cors'
  })
    .then(response => {
      // Response will be opaque, you won't be able to access its content
      console.log(response);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });