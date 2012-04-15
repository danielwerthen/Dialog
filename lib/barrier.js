function barrier(count, cb) {
  var args = []
		, failed = false;
  if (typeof count === 'function') {
    cb = count;
    count = undefined;
  }
  if (count) {
    return function (err, item) {
      if (args.length >= count)
        return;
      if (err) {
				if (!failed)
					cb(err);
				else console.log('Several barrier failures: ' + err);
				failed = true;
			}
      else {
        args.push(item);
        if (args.length >= count)
          cb(null, args);
      }
    };
  }
  else {
    return function (err, item) {
      if (err) {
				if (!failed)
					cb(err);
				else console.log('Several barrier failures: ' + err);
				failed = true;
			}
      else if (!item)
        cb(null, args);
      else {
        args.push(item);
      }
    };
  }
}
module.exports = barrier;
