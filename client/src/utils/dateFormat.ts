function changeDateFormat(date: string) {
    
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const nthNumber = (num: number) => {
        return num > 0
            ? ["th", "st", "nd", "rd"][
            (num > 3 && num < 21) || num % 10 > 3 ? 0 : num % 10
            ]
            : "";
    };


    const d = new Date(date);
    let createdDate = `${d.getDate()}${nthNumber(d.getDate())} ${month[d.getMonth()]} ${d.getFullYear()}`;
    return createdDate;


    // Other format
    // const d = new Date(date);
    // return d.toDateString();
}

export { changeDateFormat };