const SLUG = 'http://localhost:3000/api/v1/'

export const addFlightOfferToPurchases = (flightOffer) => (
    {
        type: "ADD_FLIGHT_OFFER_TO_PURCHASES",
        payload: flightOffer
    }
)

export const addFlightOfferToFavorites = (flightOffer) => (
    {
        type: "ADD_FLIGHT_OFFER_TO_FAVORITES",
        payload: flightOffer
    }
)

export const removeFlightOfferFromFavorites = (flightOffer) => (
    {
        type: "REMOVE_FLIGHT_OFFER_FROM_FAVORITES",
        payload: flightOffer
    }
)

export const removeFlightOfferFromPurchases = (flightOffer) => (
    {
        type: "REMOVE_FLIGHT_OFFER_FROM_PURCHASES",
        payload: flightOffer
    }
)

export const postPurchase = (flightOffer) => {
    return dispatch => {
        const token = localStorage.token
        if (token) {
            return fetch(SLUG + 'purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({flightOffer})
            })
            .then(r => r.json())
            .then(data => {
                if (data.id){
                    dispatch(addFlightOfferToPurchases(data))
                } else {
                    console.log(data.error)
                }
            })
        }
    }
}

export const postFavorite = (flightOffer) => {
    return dispatch => {
        const token = localStorage.token
        if (token) {
            return fetch(SLUG + 'favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({flightOffer})
            })
            .then(r => r.json())
            .then(data => {
                // console.log(data)
                // debugger
                if (data.id){
                    dispatch(addFlightOfferToFavorites(data))
                } else {
                    console.log(data.error)
                }
            })
        }
    }
}

export const deleteFavorite = (flightOffer) => {
    // debugger
    return dispatch => {
        const token = localStorage.token
        if (token) {
            return fetch(SLUG + 'favorites', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({flightOffer})
            })
            .then(r => r.json())
            .then(data => {
                if (data.message){
                    dispatch(removeFlightOfferFromFavorites(flightOffer))
                } else {
                    console.log(data.error)
                }
            })
        }
    }
}

export const deletePurchase = (flightOffer) => {
    // debugger
    return dispatch => {
        const token = localStorage.token
        if (token) {
            return fetch(SLUG + 'purchases', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({flightOffer})
            })
            .then(r => r.json())
            .then(data => {
                if (data.message){
                    dispatch(removeFlightOfferFromPurchases(flightOffer))
                } else {
                    console.log(data.error)
                }
            })
        }
    }
}