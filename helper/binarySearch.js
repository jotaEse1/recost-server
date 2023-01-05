const binarySearch = (array, value, objKey) => {
    let from = 0,
        to = array.length - 1,
        arrayFound = [],
        called = 1;

    while (from <= to) {
        let middle = Math.floor((from + to) / 2);


        if (!array[middle]) {
            arrayFound = []
            break
        }

        let title = array[middle][`${objKey}`].toLocaleLowerCase();

        if (title === value) {
            arrayFound = [array[middle]]
            break
        }
        if (title > value) {
            to = middle - 1
        }
        if (title < value) {
            from = middle + 1
        } 
        else arrayFound = []
    }

    return arrayFound
}

module.exports = {binarySearch}