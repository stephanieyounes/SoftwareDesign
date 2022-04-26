import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {isAuthenticated} from "../../services/authService";
import {addProduct} from "../../redux/cartRedux";
import {useDispatch} from "react-redux";

const ItemDetails = () => {
    const user = isAuthenticated();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [item, setItem] = useState({})
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const dispatch = useDispatch()

    useEffect(() => {
        getItem();
    }, []);

    const getItem = async () => {
        const response = await axios.get(`${apiUrl}/items/item/${id}`);
        setItem(response.data);
    }

    const handleQuantity = (type) => {
        if(type === "dec"){
            quantity > 1 && setQuantity(quantity - 1);
        } else {
            setQuantity(quantity + 1);
        }
    };


    const handleClick = () =>{
        dispatch(addProduct({...item, quantity}));
    }

    return (
        <div className="form container mt-3" style={{maxWidth: '1200px', margin: '0 auto', padding: '15px', display: 'flex'}}>
            <div className="itemLeftColumn" style={{width: '65%', position: 'relative'}}>
                <img style={{width: "75%"}} src={item.image} alt="image not found :/"/>
            </div>
            <div className="itemRightColumn" style={{width: '35%',
                marginTop: '60px'}}>
                <div className="product-description" style={{borderBottom: '1px solid #E1E8EE', marginTop: '20px'}}>
                    <span style={{fontSize: '25px', color:'rgba(145,181,229,1)', letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 'bold'}}>{item.title}</span>
                    <h1 style={{fontSize: '20px'}}>${item.price}</h1>
                    <p>{item.description}</p>
                    {
                        item.quantity <= 0 &&(
                            <h4 className="" style={{color: 'red'}}>Out of Stock</h4>
                        )}
                    {item.quantity > 0 &&(
                        <h4 className="mt-5"><span style={{color: "rgba(145,181,229,1)"}}>{item.quantity}</span> in stock</h4>
                        )}
                    { item.quantity == null &&(
                        <h4 className="mt-5" style={{color: "darkgray"}}>This item is no longer available.</h4>
                    )}
                    <div className="card-img-bottom mt-5">
                        { item.quantity <= 0 &&(
                            <button disabled className="btn btn-success mx-1 my-1" style={{fontWeight: 'bold'}}
                            >Add to Cart</button>
                        )}
                        { item.quantity > 0 &&(
                            <button
                                className="btn btn-success mx-1 my-1"
                                style={{backgroundColor: 'rgba(145,181,229,1)'}}
                                onClick={handleClick}>
                                Add to Cart
                            </button>
                        )}
                        { user.role === 'ADMIN' &&(
                            <Link to={`/editItem/${item._id}`} style={{ textDecoration: 'none' }}>
                                <button className="btn btn-danger mx-1 my-1">Edit</button>
                            </Link>
                        )}
                        <Link to="/nutrition" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-secondary mx-1 my-1">Return</button>
                        </Link>
                    </div>

                </div>

            </div>
        </div>


    )
}

export default ItemDetails;
