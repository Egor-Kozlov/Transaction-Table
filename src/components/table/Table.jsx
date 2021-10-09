import {HEB_LANGUAGE, ENG_LANGUAGE} from '../../Langeages';
import { useState, useEffect } from "react";

const Table = () => {

    const [transactionsList, settransactionsList] = useState([]) //* <- here our people arr after response
    const [visibleList, setvisibleList] = useState([]) //* <- here our people arr after response
    const [itemsOnPage, setItemsOnPage] = useState([]) //* <- here our people arr after response
    const [countPages, setcountPages] = useState(1) //* <- count pages in pagination
    const [currentPage, setcurrentPage] = useState(1) //* <- current selected page
    const [sortingField, setsortingField] = useState('')
    const [sortingOrder, setsortingOrder] = useState('asc')
    const [itemsPerPage, setitemsPerPage] = useState(10) //* <- How many element per page

    const [chechbox, setchechbox] = useState(false); //* <- Checkbox's state
    const [language, setlanguage] = useState(ENG_LANGUAGE) //* <- language on page

    const headers = [
        { name: language.id, field: '_id', sortable: true },
        { name: language.date, field: 'date', sortable: true },
        { name: language.debit, field: 'debit', sortable: true },
        { name: language.credit, field: 'credit', sortable: true },
        { name: language.sender, field: 'sender', sortable: true },
        { name: language.receiver, field: 'receiver', sortable: true }
    ]

    useEffect(() => {
        const response = () => {
            fetch('https://jsonkeeper.com/b/A0DJ')
                .then(response => response.json().then(data => {
                    let dataWithUniqId = _returnArrayWithUniqId(data);
                    settransactionsList(dataWithUniqId);
                    setvisibleList(dataWithUniqId);
                    setItemsOnPage(_getVisibleItems(dataWithUniqId));
                    console.log("firstRendering");
                }))
        }
        response()
    }, [])

    useEffect(() => {
        _getPageCount(visibleList.length);
        setItemsOnPage(_getVisibleItems(visibleList));
    }, [visibleList, itemsPerPage])

    useEffect(() => {
        setItemsOnPage(_getVisibleItems(visibleList));
    }, [currentPage, itemsPerPage])

    useEffect(() => {
        chechbox ? setlanguage(HEB_LANGUAGE) : setlanguage(ENG_LANGUAGE)
    }, [chechbox])

    const _returnArrayWithUniqId = array => {
        return array.map((item, index) => {
            item.uniqKey = index;
            return item;
        });
    }

    const _getPageCount = itemCount => {
        var pageCount = Math.ceil(itemCount / itemsPerPage);
        const arr = []
        for (let index = 1; index <= pageCount; index++) {
            arr.push(index)
        }
        setcountPages(arr)
    }

    const _getVisibleItems = defaultArray => {
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = defaultArray.length < currentPage * itemsPerPage ? defaultArray.length : currentPage * itemsPerPage
        const itemsOnPage = defaultArray.slice(startIndex, endIndex);
        return itemsOnPage;
    }

    const sortElementAsc = (array, field) => {
        array.sort((a, b) => {
            if (a[field] > b[field]) {
                return 1;
            }
            if (a[field] < b[field]) {
                return -1;
            }
            return 0;
        });
        return [...array];
    }

    const sortElementDesc = (array, field) => {
        array.sort((a, b) => {
            if (a[field] > b[field]) {
                return -1;
            }
            if (a[field] < b[field]) {
                return 1;
            }
            return 0;
        });
        return [...array];
    }

    const onInputSearch = (value) => {
        let arr = [];
        if (value) {
            arr = transactionsList.filter((e) =>
                e._id.toLowerCase().includes(value.toLowerCase()) ||
                e.date.toLowerCase().includes(value.toLowerCase()) ||
                e.sender.toLowerCase().includes(value.toLowerCase()) ||
                e.receiver.toLowerCase().includes(value.toLowerCase()) ||
                e.debit.includes(value) || e.credit.includes(value)
            );
        } else {
            arr = transactionsList;
        }

        if (sortingField) {
            if (sortingOrder === "asc") {
                arr = sortElementAsc(arr, sortingField);
            }
            if (sortingOrder === "desc") {
                arr = sortElementDesc(arr, sortingField);
            }
        }

        setvisibleList(arr);
        setcurrentPage(1);
    }

    const onSortingChange = (field) => {
        const order = field === sortingField && sortingOrder === "asc" ? "desc" : "asc";
        setsortingField(field);
        setsortingOrder(order);
        let sortedArray = [];
        if (order === "asc") {
            sortedArray = sortElementAsc(visibleList, field);
        }
        if (order === "desc") {
            sortedArray = sortElementDesc(visibleList, field);
        }
        setvisibleList(sortedArray);
    }

    const onPlusPage = () => {
        if (countPages.length > currentPage) {
            setcurrentPage(currentPage + 1)
        }
    }

    const onMinusPage = () => {
        if (currentPage > 1) {
            setcurrentPage(currentPage - 1)
        }
    }
 
    return (
        <div className="table-container">
            <div className="table__header" style = {language === HEB_LANGUAGE ? {alignItems : 'flex-end'} : null}>
            <h1 className='tible-title'>{language.projectName}</h1>
            <div class="switch-button">
                <input class="switch-button-checkbox" type="checkbox" checked={chechbox} onChange={() => setchechbox(!chechbox)}></input>
                <label class="switch-button-label" for=""><span class="switch-button-label-span">English</span></label>
            </div>
            </div>
            <div className='table'>
                <div className="table__actions">
                    <input className='table__input-search' type="text"
                        onChange={(event) => onInputSearch(event.target.value)}
                        placeholder = {language.search_placeholder} />
                    <div class="table__setect-container">
                    <label className = 'table__select-lable' for="table__select">{language.countElementsPerPage}:</label>
                    <select onChange = {(event) => setitemsPerPage(+event.target.value)} id="table__select">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="60">60</option>
                        <option value="100">100</option>
                    </select>
                    <span class="focus"></span>
                    </div>
                </div>
                <ul className="table__body">
                    <li className="table__row table__row--default">
                        <ul className='transaction__list'>
                            {headers.map(({ name, field, sortable }) => {
                                return (
                                    <li className={`transaction__item transaction__item--${field}`}
                                        onClick={() => sortable ? onSortingChange(field) : null}
                                        key={name}>
                                        {name}
                                        {sortingField && sortingField === field ? (sortingOrder === "asc"
                                            ? "⬆"
                                            : "⬇") : null}
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                    {itemsOnPage.length ? itemsOnPage.map((transaction) => {
                        return (
                            <li className="table__row" key={transaction._id}>
                                <ul className='transaction__list'>
                                    <li className='transaction__item transaction__item--id'>{transaction._id}</li>
                                    <li className='transaction__item transaction__item--data'>{transaction.date}</li>
                                    <li className='transaction__item transaction__item--debit'>{transaction.debit}</li>
                                    <li className='transaction__item transaction__item--credit'>{transaction.credit}</li>
                                    <li className='transaction__item transaction__item--sender'>{transaction.sender}</li>
                                    <li className='transaction__item transaction__item--receiver'>{transaction.receiver}</li>
                                </ul>
                            </li>
                        )
                    }) : <p className = 'table__no-result'>No result</p>}
                </ul>
                <div className="table__footer">
                    {itemsOnPage.length ? <div className="pagination">
                        <ul className='pagination__list'>
                            <li className='pagination__item' onClick={() => onMinusPage()}>{language.previusPage}</li>
                            {countPages.length > 1 ?
                                countPages.map((page) => {
                                    return (
                                        <li className='pagination__item'
                                            style={{ backgroundColor: currentPage === page ? '#6E6893' : 'white' }}
                                            onClick={() => {
                                                setcurrentPage(page)
                                            }} key={page}>{page}
                                        </li>
                                    )
                                }) 
                                : <p className = 'one-page'>Only one page</p>}
                            <li className='pagination__item' onClick={() => onPlusPage()}>{language.nextPage}</li>
                        </ul>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}

export default Table