'use client';
import { useRouter, useSearchParams , usePathname} from 'next/navigation';
import ItemCard from '../(shop)/itemCard'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './page.css';

const prices = [
    {
        name: '$1 to $20',
        value: '1-20',
    },
    {
        name: '$21 to $50',
        value: '21-50',
    },
    {
        name: '$51 to $150',
        value: '51-150', 
    },
    {
        name: '$150+',
        value: '151-10000',
    }
];


export default async function ClientComponent({products}) {
    console.log(products);
    const router = useRouter();
    const param = useSearchParams();
    let countProducts = 0;
   {products?.map((item) => (
      countProducts++
    ))}

    const {
        query = 'all',
        price = 'all',
        page = 1,
    } = param;


    const filterSearch =  ({
        //Get all the criterias
        page,
        sort,
        searchQuery,
        price, 
    }) => {
        let selected = "";  
        const params = new URLSearchParams(param.toString())
        if (page){
            params.page = page;
            selected = "page";
        }
        if (sort){
            params.sort = sort;
            selected = "sort";
        }
        if (searchQuery) {
            params.searchQuery = searchQuery;
            selected = "searchQuery";
        }
        if (price) {
            params.price = price;
            selected = "price";
        }

        const value = event.target.value.trim();

        if (!value) {
            params.delete(selected);
        } else {
            params.set(selected, event.target.value);
        } 
        const search = params.toString();
        const query = search ? `?${search}` : "";
        router.push(`/search/${query}`);
    };


    const sortHandler = (e) => {
        filterSearch({ sort: e.target.value });
    };

    const priceHandler = (e) => {
        filterSearch({ price: e.target.value });
    };

    const ratingHandler = (e) => {
        filterSearch({ rating: e.target.value });
    };

    return (
        <div className = "first">
            <div>
                <div className="margin">
                    <h2>Prices</h2>
                    <select
                        className="width" 
                        // value={price} 
                        onChange={priceHandler}
                    >
                        <option value = "all">All</option>
                        {prices && prices.map((price) => (
                            <option key = {price.name} value ={price.value}>
                                {price.name}
                            </option> 
                        ))}
                    </select>
                </div>
            </div>
            <div className="second">
                <div>
                    <div className="align">
                        {products?.length === 0 ? 'No' : countProducts } Results
                        {query !== 'all' && query !== '' && ' : ' + query}
                        {price !== 'all' && ' : Price ' + price}
                        &nbsp;
                    </div>
                    <div>
                        Sort by{' '}
                        <select onChange={sortHandler}>
                            <option value="lowest">Price: Low to High</option>
                            <option value="highest">Price: High to Low</option>
                        </select>
                        <button onClick={() => router.push('/search')}>
                            <HighlightOffIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div>
                    <div className="items">
                    {products?.map((item) => (
                        <ItemCard
                        key={item.itemId}
                        item={item}
                        />
                    ))}
                </div>
                </div>
            </div>
        </div>
    );
}

