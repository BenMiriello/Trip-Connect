import React, { Component } from 'react'
import { searchForFlights, queryTestFlights, refreshResponse } from '../Redux/actions/searchAndResults'
import { connect } from 'react-redux'
import { SelectNumberOfPeople } from '../Components/SearchBar'
import { fetchAirports } from '../Redux/actions/searchAirports'
import { 
    Button, 
    Form, 
    Input, 
    Card, 
    Dropdown,
    Search,
    // Grid,
    // Header,
    // Segment
} from 'semantic-ui-react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Separator } from '../StyleComponents/Separator'
import _ from 'lodash'

class SearchBar extends Component {

    initialState = {
        switchRoundTripOneWay: 'Round Trip',
        origin: {
            originIsLoading: false,
            originResults: [],
            originValue: '',
            originOptions: []
        },
        destination: {
            destinationIsLoading: false,
            destinationResults: [],
            destinationValue: '',
            destinationOptions: []
        },
        searchParams: {
            originLocationCode: '',
            destinationLocationCode: '',
            departureDate: '',
            returnDate: '',
            travelClass: 'Economy',
            adults: 1,
            children: 0,
            infants: 0,
            nonStop: false,
            maxPrice: 0
        },
    }

    state = this.initialState

    handleOriginResultSelect = (e, { result }) => this.setState(prevState => ({ 
        origin: {
            ...prevState.origin,
            originValue: result.title
        }
    }))

    handleOriginSearchChange = (e, { value }) => {
        this.setState(prevState => ({
            origin: {
                ...prevState.origin,
                originValue: value
            }
        }), () => {
            if (this.state.origin.originValue.length < 1) {
                return this.setState({
                    origin: {
                        ...this.initialState.origin
                    }
                })
            }
            if (!this.state.origin.originIsLoading){
                this.setState(prevState => ({ 
                    origin: { 
                        ...prevState.origin,
                        originIsLoading: true,
                    }
                }), () => {
                    this.getOriginAirports(value).then(() => {
                        this.setState(prevState => ({
                            origin: {
                                ...prevState.origin,
                                originIsLoading: false
                            }
                        }))
                    })
                })
            }
        })
    }

    getOriginAirports = async (value) => {
        let raw_airports
        if (value) {
            raw_airports = await fetchAirports(value)
        } else {
            raw_airports = []
        }

        if (raw_airports) {
            let airports = raw_airports.map(airport => ({
                code: airport.code,
                name: airport.name,
                city: airport.city
            }))

            let resultsObject = {}
            let duplicate_cities = airports.map(airport => airport.city)
            let unique_cities = duplicate_cities.filter(this.unique)
            
            let airportsByCity = unique_cities.map(city => {
                let theCityObject = {  
                    name: city,
                    results: []
                }
                resultsObject[city] = theCityObject
                return {[city]: theCityObject}
            })
            
            airports.forEach(airport => {
                let target = airportsByCity.find(abc => Object.values(abc)[0].name === airport.city)
                
                Object.values(target)[0].results.push({
                    title: airport.code,
                    description: airport.name
                })
            })
    
            // airportsByCity.sort((a,b) => b[Object.keys(b)[0]].results.length - a[Object.keys(a)[0]].results.length)
    
            this.setState(prevState => ({
                origin: {
                    ...prevState.origin,
                    originResults: resultsObject
                }
            }))
            return airportsByCity
        }
    }

    handleDestinationResultSelect = (e, { result }) => this.setState(prevState => ({ 
        destination: {
            ...prevState.destination,
            destinationValue: result.title
        }
    }))

    handleDestinationSearchChange = (e, { value }) => {
        this.setState(prevState => ({
            destination: {
                ...prevState.destination,
                destinationValue: value
            }
        }), () => {
            if (this.state.destination.destinationValue.length < 1) {
                return this.setState({
                    destination: {
                        ...this.initialState.destination
                    }
                })
            }
            if (!this.state.destination.destinationIsLoading){
                this.setState(prevState => ({ 
                    destination: { 
                        ...prevState.destination,
                        isLoading: true,
                    }
                }), () => {
                    this.getDestinationAirports(value).then(() => {
                        this.setState(prevState => ({
                            destination: {
                                ...prevState.destination,
                                isLoading: false
                            }
                        }))
                    })
                })
            }
        })
    }

    getDestinationAirports = async (value) => {
        let raw_airports
        if (value) {
            raw_airports = await fetchAirports(value)
        } else {
            raw_airports = []
        }

        let airports = raw_airports.map(airport => ({
            code: airport.code,
            name: airport.name,
            city: airport.city
        }))

        let resultsObject = {}
        let duplicate_cities = airports.map(airport => airport.city)
        let unique_cities = duplicate_cities.filter(this.unique)
        
        let airportsByCity = unique_cities.map(city => {
            let theCityObject = {  
                name: city,
                results: []
            }
            resultsObject[city] = theCityObject
            return {[city]: theCityObject}
        })
        
        airports.forEach(airport => {
            let target = airportsByCity.find(abc => Object.values(abc)[0].name === airport.city)
            
            Object.values(target)[0].results.push({
                title: airport.code,
                description: airport.name
            })
        })

        // airportsByCity.sort((a,b) => b[Object.keys(b)[0]].results.length - a[Object.keys(a)[0]].results.length)

        this.setState(prevState => ({
            destination: {
                ...prevState.destination,
                destinationResults: resultsObject
            }
        }))
        return airportsByCity
    }

    unique = (val, idx, self) => {
        return self.indexOf(val) === idx
    }

    handleOnChange = e => {
        let param = e.target.name
        let value = e.target.value
        this.setState(prevState => ({
            searchParams: {
                ...prevState.searchParams,
                [param]: value
            }
        }))
    }

    handleOnChangeLocation = e => {
        let param = e.target.name
        let value = e.target.value
        this.setState(prevState => ({
            searchParams: {
                ...prevState.searchParams,
                [param]: value
            }
        }))
        // this.getAirports(e)
    }

    handleDateChange = (time, type) => {
        this.setState(prevState => ({
            searchParams: {
                ...prevState.searchParams,
                [type]: time
            }
        })
            // , () => {
            //     console.log(this.state);
            //     debugger
            // }
        )
    }

    handleSubmit = e => {
        e.preventDefault()
        let searchParams = this.state.searchParams
        searchParams.originLocationCode = this.state.origin.originValue
        searchParams.destinationLocationCode = this.state.destination.destinationValue
        if (this.props.featureSelection.active) {
            this.props.queryTestFlights(searchParams)
        } else {
            this.props.searchForFlights(searchParams)
        }
        this.props.resetFeatureSelectionToFalse()

        this.props.handleSetInitialLoading()

        // setTimeout(this.props.refreshResponse(this.props.response), 500)
        // setTimeout(() => !this.props.response.resolved ? this.props.refreshResponse(this.props.response) : null, 1000)
        // setTimeout(() => !this.props.response.resolved ? this.props.refreshResponse(this.props.response) : null, 1500)
    }

    handleSwitchTravelClass = e => {
        let selection = e.target.textContent
        this.setState(prevState => ({
            searchParams: {...prevState.searchParams, travelClass: selection}
        }))
    }

    handleSwitchRoundTripOneWay = e => {
        // let selection = e.target.textContent
        // this.setState({
        //     switchRoundTripOneWay: selection
        // })
    }

    handleAddRemovePerson = (e, type, operation) => {
        let person = type.toLowerCase()
        this.setState(prevState => ({
            searchParams: {
                ...prevState.searchParams,
                [person]: operation === "plus" ? prevState.searchParams[person] + 1 : "minus" && prevState.searchParams[person] >= 1 ? prevState.searchParams[person] - 1 : prevState.searchParams[person]
            }
        }))
    }

    handleSwitchNonStop = (e, bool) => {
        this.setState(prevState => ({
            searchParams: {
                ...prevState.searchParams, 
                nonStop: bool
            }
        }))
    }

    handleStartDateChange = date => {
        this.setState(prevState => ({
            searchParams: {
                ...prevState.searchParams, 
                startDate: date
            }
        }))
    }

    handleSwapLocations = e => {
        e.stopPropagation() 
        this.setState(prevState => {
            return({
                // ...prevState,
                // searchParams: {
                //     ...prevState.searchParams,
                //     originLocationCode: prevState.searchParams.destinationLocationCode,
                //     destinationLocationCode: prevState.searchParams.originLocationCode
                // }
                origin: {
                    ...prevState.origin,
                    originValue: prevState.destination.destinationValue
                },
                destination: {
                    ...prevState.destination,
                    destinationValue: prevState.origin.originValue
                }
            })
        })
    }

    totalPassengers = () => {
        let params = this.state.searchParams
        let total = params.adults + params.children + params.infants 
        return `${total} Passenger${total === 1 ? '' : 's'}`
    }

    render() {
        console.log(this.state.searchParams.departureDate)
        const { originIsLoading, originValue, originResults } = this.state.origin
        const { destinationIsLoading, destinationValue, destinationResults } = this.state.destination
        return(
            <>
                <Separator px={20}/>
                <Card color='blue' style={{"width": "90%", "margin": "auto"}}>
                    <Form onSubmit = {this.handleSubmit} style={{"margin": "15px", "marginLeft":"auto","marginRight":"auto"}}>
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Origin' >
                                <Search
                                    category
                                    placeholder='Origin'
                                    label='Origin'
                                    name='originLocationCode'
                                    autoComplete='off'
                                    loading={originIsLoading}
                                    onResultSelect={this.handleOriginResultSelect}
                                    onSearchChange={this.handleOriginSearchChange}
                                    results={originResults}
                                    value={this.props.featureSelection.active ? this.props.featureSelection.originLocationCode : originValue}
                                />
                            </Form.Field>
                            <Button
                                onClick={this.handleSwapLocations} 
                                icon={{name: "exchange", onClick:(e => e.preventDefault())}}
                                style={{"height":"20px", "width":"20px","marginRight":"15px", "marginTop":"23px", "backgroundColor":"white"}}
                            />
                            <Form.Field control={Input} label='Destination' >
                                <Search
                                    category
                                    placeholder='Destination'
                                    label='Destination'
                                    name='destinationLocationCode'
                                    autoComplete='off'
                                    loading={destinationIsLoading}
                                    onResultSelect={this.handleDestinationResultSelect}
                                    onSearchChange={this.handleDestinationSearchChange}
                                    results={destinationResults}
                                    value={this.props.featureSelection.active ? this.props.featureSelection.destinationLocationCode : destinationValue}
                                />
                            </Form.Field>
                            <Form.Field control={Input} style={{"marginLeft":"20px"}} label='&emsp;&ensp;Departure Date'>
                                <DatePicker
                                    name="departureDate"
                                    value={this.props.featureSelection.active ? this.props.featureSelection.departureDate : this.state.searchParams.departureDate?.toString().substring(0,15)}
                                    selected={this.state.searchParams.departureDate}
                                    dateFormat="yyyy-mm-dd"
                                    placeholder='Departure Date'
                                    onChange={time => this.handleDateChange(time, 'departureDate')}
                                    autoComplete="off"
                                />
                            </Form.Field>
                            <Form.Field control={Input} label='Return Date'>
                                <DatePicker
                                    name="returnDate"
                                    value={this.props.featureSelection.active ? this.props.featureSelection.returnDate : this.state.searchParams.returnDate?.toString().substring(0,15)}
                                    selected={this.state.searchParams.returnDate}
                                    dateFormat="yyyy-mm-dd"
                                    onChange={time => this.handleDateChange(time, 'returnDate')}
                                    autoComplete="off"
                                />
                            </Form.Field>
                            {/* <div style={{"textAlign": "center", "margin": "auto", "marginTop": "23px", "marginLeft": "4px"}}> */}
                            <div>
                                <Button type="submit" style={{"background":"white"}}>
                                    <img src='flight-finder-logo-and-find-cutout.png' style={{"height":"22px", "marginTop":"18px"}}/>
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Group widths='equal'>
                            <Dropdown 
                                text={this.state.switchRoundTripOneWay} 
                                style={{"marginLeft": "20px", "marginRight": "20px"}}>
                                <Dropdown.Menu onClick={this.handleSwitchRoundTripOneWay}>
                                    <Dropdown.Item text='One Way' />
                                    <Dropdown.Item text='Round Trip' />
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown 
                                text={this.state.searchParams.travelClass} 
                                style={{"marginLeft": "20px", "marginRight": "20px"}}>
                                <Dropdown.Menu onClick={this.handleSwitchTravelClass}>
                                    <Dropdown.Item text='Economy' />
                                    <Dropdown.Item text='Premium Economy' />
                                    <Dropdown.Item text='Business' />
                                    <Dropdown.Item text='First Class' />
                                    <Dropdown.Item text='Any' />
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown
                                onClick={e => e.stopPropagation()} 
                                text={this.totalPassengers()} 
                                style={{"marginLeft": "20px", "marginRight": "20px"}}>
                                <Dropdown.Menu>
                                    <SelectNumberOfPeople 
                                        type={'adults'}   
                                        number={this.state.searchParams.adults} 
                                        handleAddRemovePerson={this.handleAddRemovePerson}
                                    />
                                    <SelectNumberOfPeople 
                                        type={'children'} 
                                        number={this.state.searchParams.children} 
                                        handleAddRemovePerson={this.handleAddRemovePerson}
                                    />
                                    <SelectNumberOfPeople 
                                        type={'infants'}  
                                        number={this.state.searchParams.infants} 
                                        handleAddRemovePerson={this.handleAddRemovePerson}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown 
                                text={this.state.searchParams.nonStop ? "Nonstop Only" : "Allow Multiple Stops"}
                                style={{"marginLeft": "20px", "marginRight": "20px"}}>
                                <Dropdown.Menu >
                                    <Dropdown.Item 
                                        text='Nonstop Only' 
                                        onClick={e => this.handleSwitchNonStop(e, true)}
                                    />
                                    <Dropdown.Item 
                                        text='Allow Multiple Stops'
                                        onClick={e => this.handleSwitchNonStop(e, false)} 
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </Form>
                </Card>
            </>
        )
    }
}

const MSTP = state => ({
    response: state.response
})

const MDTP = dispatch => ({
    searchForFlights: (searchParams) => dispatch(searchForFlights(searchParams)),
    queryTestFlights: (searchParams) => dispatch(queryTestFlights(searchParams)),
    refreshResponse: (response) => dispatch(refreshResponse(response))
})

export default connect(MSTP, MDTP)(SearchBar)

