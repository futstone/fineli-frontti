import React, { Component } from 'react'
import { Grid, Table, Input, Button, Icon, Container, List } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import tablestyles from '../styles/tablestyles'
import BarChart from './BarChart'
import { setFoodItemHover } from '../rdc/reducer'

class SearchResultsTable extends Component {
  constructor(props) {
  	super(props)
  }

  mouseover = (row) => {
  	//console.log(row)
  	this.props.setFoodItemHover(row)
  }

  firstColumn = {
  	Header: 'Elintarvike',
  	accessor: 'foodname',
  	id: 666,
  	Cell: row => (<div 
  		onMouseOver={() => this.mouseover(row.original)}>
  		{row.original.foodname}
  		</div>
  	)
  }

  tableColumnSortOverride = (a, b) => parseFloat(b) - parseFloat(a)

  searchphraseInputchange = (e) => { 
  	this.refs.reactTable.filterColumn(this.firstColumn, e.target.value) 
  }

  render() {
  	return (
  	  <ReactTable
	      ref="reactTable"
	      data={ this.props.basedata }
	      columns={[this.firstColumn, {
	      	Header: 'prot',
	      	accessor: 'PROT',
	      	width: 50,
	      	sortMethod: this.tableColumnSortOverride,
	      	style: { backgroundColor: '#8ef1ae'}
	      },{
	      	Header: 'fat',
	      	accessor: 'FAT',
	      	width: 50,
	      	sortMethod: this.tableColumnSortOverride,
	      	style: { backgroundColor: '#ff8d8d'}
	      },{
	      	Header: 'hh',
	      	accessor: 'CHOAVL',
	      	width: 50,
	      	sortMethod: this.tableColumnSortOverride,
	      	style: { backgroundColor: '#a8a8ff'}
	      },{
	      	Header: 'kcal',
	      	accessor: 'ENERC',
	      	width: 50,
	      	sortMethod: this.tableColumnSortOverride,
	      	Cell: row => (<div>{ Math.round(0.2388 * parseFloat(row.value)) }</div>)
	      }, {
	      	Header: 'Jakauma (prot, fat, hh)',
	      	Cell: row => (<BarChart prot={ row.original.PROT } fat={ row.original.FAT } hh={ row.original.CHOAVL }/>)
	      }]}
	      getTdProps={ () => { return tablestyles.tabledata } }
	      getTheadFilterProps={ () => { return tablestyles.filterrow } }
	      getPaginationProps={ () => { return tablestyles.pagination } }
	      previousText={'Edellinen'}
			  nextText={'Seuraava'}
			  pageText={'Sivu'}
				rowsText={'riviä'}
			  ofText={'...'}
			  pageSizeOptions={[20, 25, 30, 35, 40, 45, 50, 100, 200]}
			  defaultPageSize={35}
			  className={'-highlight'}
			  filterable
			  defaultFilterMethod={(filter, row) => String(row[filter.id]).includes(filter.value.toUpperCase())}
			  SubComponent={row => {
			  	return (
			  	  <Container fluid>
			  	    <Grid.Row>
			  	      <Grid.Column width={16}>
		    	  	    <List style={ tablestyles.list } items={ this.props.componentsOriginalRows.map((component) => {
		    	  	      return component.nimi + ": " + row.original[component.koodi] + " (" + row.original[component.koodi] + ")"
		    	  	    }) }/>
			  	      </Grid.Column>
			  	    </Grid.Row>
			  	  </Container>
			  	)
		  }}/>
  	)
  }
}

const mapStateToProps = (state) => {
  return {
  	basedata: state.results,
    storecomponents: state.components,
    componentsOriginalRows: state.componentsOriginalRows
  }
}

export default connect(
  mapStateToProps, { setFoodItemHover }, null, { withRef: true }
)(SearchResultsTable)