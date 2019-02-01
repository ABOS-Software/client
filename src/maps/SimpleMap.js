import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import {mapKey} from './mapKey';
import restClient from '../grailsRestClient';
import {GET_LIST, showNotification} from 'react-admin';
import supercluster from 'points-cluster';
import SimpleMarker from './markers/SimpleMarker';
import ClusterMarker from './markers/ClusterMarker';
import Drawer from '@material-ui/core/Drawer';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

const dataProvider = restClient;
const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  sideBar: {
    display: 'flex',
    padding: 10,
    flexDirection: 'column'

  },
  nameCard: {
    display: 'flex',
    padding: 10,
    flexDirection: 'column'
  },
  dataRow: {},
  yearButton: {}
};
class SimpleMap extends Component {
    static defaultProps = {
      center: {
        lat: 59.95,
        lng: 30.33
      },
      zoom: 11,
      clusterRadius: 60,
      hoverDistance: 30,
      options: {
        minZoom: 3,
        maxZoom: 15
      },
      style: {
        position: 'relative',
        margin: 0,
        padding: 0,
        flex: 1
      }
    };
    state = {
      mapProps: {
        center: {
          lat: 0,
          lng: 0
        },
        zoom: 11
      },
      markers: [],
      customers: [],
      clusterRadius: 30,
      options: {
        minZoom: 3,
        maxZoom: 19
      },
      getCluster: (e) => {
      },
      clusters: [],
      hoveredMarkerId: {},
      hoverDistance: 30,
      right: false,
      drawerInfoId: -1,
      sideBarContents: [],
      years: []

    };
    withinError = (in1, in2, error) => {
      return Math.abs(Math.abs(in1 - in2) / in1) <= error;
    };

    customerReducer = () => response => response.data.reduce((custs, customer) => {
      let address = this.getCustomerAddress(customer);
      let place = this.getPlace(custs, customer, address);
      if (place) {
        custs['custs'][place.id]['customers'][customer.year.id] = this.deriveCustomerObject(customer);
      } else {
        let id = custs['places'].length;
        custs['places'].push({
          id: id,
          latitude: customer.latitude,
          longitude: customer.longitude,
          address: address
        });
        custs['custs'][id] = {
          latitude: customer.latitude,
          longitude: customer.longitude,
          id: custs['number'] + 1,
          customers: {
            [customer.year.id]: this.deriveCustomerObject(customer)
          }
        };
        custs['number'] = custs['number'] + 1;
      }
      return custs;
    },
    {number: 0, custs: {}, places: []}
    );

    getCustomerAddress (customer) {
      return customer.streetAddress + ' ' + customer.city + ' ' + customer.state + ' ' + customer.zipCode;
    }

    getPlace (custs, customer, address) {
      return custs['places'].find(place => ((this.withinError(place.latitude, customer.latitude, 0.000001) && this.withinError(place.latitude, customer.latitude, 0.000001)) || place.address === address));
    }

  createMapMarkersAndSave =() => (customersArr) => {
    let customers = customersArr.custs;

    let center = this.calculateMapCenter(customers);


    this.setState({
      customers: customers,
      mapProps: {center: center, zoom: 11},
      markers: this.createMapMarkerList(customers),
      places: customersArr.places
    });
  };

  createMapMarkerList (customers) {
    let mapMarkers = [];

    Object.keys(customers).forEach(address => {
      let customer = customers[address];

      /* mapMarkers.push(<MapMarker key={customer.id} lat={customer.latitude} lng={customer.longitude}
                                         customer={customer}/>); */
      mapMarkers.push({
        id: customer.id,
        lat: customer.latitude,
        lng: customer.longitude,
        text: '',
        customer: customer
      });
    });
    return mapMarkers;
  }

  calculateMapCenter (customers) {
    let nCustomers = 1;
    let lat = 0;
    let lng = 0;
    if (Object.keys(customers).length > 0) {
      nCustomers = Object.keys(customers).length;
    }
    Object.keys(customers).forEach(address => {
      let customer = customers[address];
      lat += customer.latitude;
      lng += customer.longitude;
    });
    return {lat: lat / nCustomers, lng: lng / nCustomers};
  }

  getCustomers = () => {
      dataProvider(GET_LIST, 'customers', {
        filter: {},
        sort: {field: 'id', order: 'DESC'},
        pagination: {page: 1, perPage: 1000}
      }).then(this.customerReducer()).then(this.createMapMarkersAndSave());
    };
    handleMarkerClick = (id, props) => (event) => {
      console.log(id);
      console.log(props);
      this.renderSideBarContents(props.customers.customers);
      this.setState({right: true, clickedCustomer: props.customers.customers});
    };
    getMapMarkers = () => {

    };
    toggleDrawer = (side, open) => () => {
      this.setState({
        [side]: open
      });
    };

    setHoveredMarkerId = (id) => {
      this.setState({hoveredMarkerId: id});
    };

    setMapProps = ({center, zoom, bounds}) => {
      this.setState({mapProps: {center, zoom, bounds}});
    };
    onChange = ({center, zoom, bounds}) => {
      if (center !== this.state.mapProps.center || zoom !== this.state.mapProps.zoom || bounds !== this.state.mapProps.bounds) {
        this.setMapProps({center, zoom, bounds});
      }
    };

    onChildMouseEnter = (hoverKey, {id}) => {
      this.setHoveredMarkerId(id);
    };

    onChildMouseLeave = (/* hoverKey, childProps */) => {
      this.setHoveredMarkerId(-1);
    };

    componentDidMount () {

    }

    openCustomer = (cID) => (event) => {
      push('/');
    };
    renderSideBarContents = (customers) => {
      let cards = [];
      let names = {};
      Object.keys(customers).forEach(customerKey => {
        let customer = customers[customerKey];

        if (!(customer.customerName in names)) {
          names[customer.customerName] = this.deriveCustomerObject(customer);
        }
        names[customer.customerName].years.push({
          yearID: customerKey,
          yearText: this.state.years['y-' + customerKey],
          cID: customer.id
        });
      });
      Object.values(names).forEach(customerGroup => {
        cards.push(this.renderCustomerGroupCard(customerGroup));
      });
      this.setState({sideBarContents: cards});
    };

    deriveCustomerObject (customer) {
      return {
        customerName: customer.customerName,
        phone: customer.phone,
        email: customer.custEmail,
        id: customer.id,
        year: customer.year.id,
        address: customer.address,
        donation: customer.donation,
        years: []
      };
    }

    renderCustomerGroupCard (customerGroup) {
      const {classes} = this.props;

      let buttons = [];
      customerGroup.years.forEach(year => {
        buttons.push(<Button key={'Cg-' + customerGroup.id + '-Button-' + year.yearID}
          className={classes.yearButton} variant={'outlined'} component={Link}
          to={'/customers/' + year.cID}>{year.yearText}</Button>);
      });
      return (<Card className={classes.nameCard} key={'Cg-' + customerGroup.id + '-Card'}>
        <div className={classes.dataRow}>
          <Typography variant='title'>Name: </Typography>
          <Typography>{customerGroup.customerName}</Typography>
        </div>
        <div className={classes.dataRow}>
          <Typography variant='title'>Address: </Typography>
          <Typography>{customerGroup.address}</Typography>
        </div>
        <div className={classes.dataRow}>
          <Typography variant='title'>Phone: </Typography>
          <Typography>{customerGroup.phone}</Typography>
        </div>
        <div className={classes.dataRow}>
          <Typography variant='title'>Email: </Typography>
          <Typography>{customerGroup.email}</Typography>
        </div>
        <div className={classes.dataRow}>
          <Typography variant='title'>Orders: </Typography>
          {buttons}
        </div>
      </Card>);
    }

    getYears () {
      dataProvider(GET_LIST, 'Years', {
        filter: {},
        sort: {field: 'id', order: 'DESC'},
        pagination: {page: 1, perPage: 1000}
      }).then(response => {
        let yrs = {};
        response.data.forEach(year => {
          yrs['y-' + year.id] = year.year;
        });
        this.setState({years: yrs});
      });
    }

    componentWillMount () {
      this.getYears();
      this.getCustomers();
    }

    componentDidUpdate (prevProps, prevState) {
    /* if (this. state.markers !== prevState.markers) {
           const { markers = [], clusterRadius, options: { minZoom, maxZoom } } = this.state;
           this.setState({getCluster: supercluster(
                   markers,
                   {
                       minZoom, // min zoom to generate clusters on
                       maxZoom, // max zoom level to cluster the points on
                       radius: clusterRadius, // cluster radius in pixels
                   }
                   )
               }
           )

       } */
      if (this.state.mapProps !== prevState.mapProps || this.state.markers !== prevState.markers) {
        const {mapProps, getCluster} = this.state;
        this.setState({
          clusters: this.calculateClusters()
        }
        );
      }
      if (this.state.clusters !== prevState.clusters && this.state.hoveredMarkerId !== prevState.hoveredMarkerId) {
        this.setState({
          clusters: this.updateHoveredCluster()
        }
        );
      }
    }

    updateHoveredCluster () {
      const {clusters, hoveredMarkerId} = this.state;

      return clusters
        .map(({id, ...cluster}) => ({
          ...cluster,
          hovered: id === hoveredMarkerId
        }));
    }

    calculateClusters () {
      const {mapProps} = this.state;

      return mapProps.bounds
        ? supercluster(
          this.state.markers,
          {
            minZoom: this.state.options.minZoom, // min zoom to generate clusters on
            maxZoom: this.state.options.maxZoom, // max zoom level to cluster the points on
            radius: this.state.clusterRadius // cluster radius in pixels
          })(mapProps)
          .map(({wx, wy, numPoints, points}) => ({
            lat: wy,
            lng: wx,
            customers: points[0].customer,
            text: points[0].text ? points[0].text : '',
            numPoints,
            id: `${numPoints}_${points[0].id}`
          }))
        : [];
    }

    render () {
      return (
        <div>
          {this.renderMap()}
          {this.renderSidePane()}</div>

      );
    }

    renderSidePane () {
      const {classes} = this.props;
      return <Drawer anchor='right' open={this.state.right} onClose={this.toggleDrawer('right', false)}>
        <div
          tabIndex={0}
          role='button'
          onClick={this.toggleDrawer('right', false)}
          onKeyDown={this.toggleDrawer('right', false)}
        >
          <div className={classes.sideBar}>
            {this.state.sideBarContents}
          </div>
        </div>
      </Drawer>;
    }

    renderMap () {
      const {
        hoverDistance, options,
        mapProps: {center, zoom}
      } = this.state;
      return <div style={{height: '100vh', width: '100%'}}>

        <GoogleMapReact
          options={options}
          hoverDistance={hoverDistance}
          center={center}
          zoom={zoom}
          onChange={this.onChange}
          bootstrapURLKeys={{key: mapKey}}
        >
          {
            this.getMapClusterMarkers()
          }
        </GoogleMapReact>
      </div>;
    }

    getMapClusterMarkers () {
      const {

        clusters
      } = this.state;
      return clusters
        .map(({id, numPoints, ...markerProps}) => (
          numPoints === 1
            ? <SimpleMarker key={id} {...markerProps}
              onClick={this.handleMarkerClick(id, {...markerProps})}/>
            : <ClusterMarker key={id} {...markerProps} numPoints={numPoints}/>
        ));
    }
}

export default connect(null, {
  push,
  showNotification

})(
  withStyles(styles)(SimpleMap));
