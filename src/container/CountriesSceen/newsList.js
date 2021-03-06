import React, { Component } from 'react'
import { Text, Spinner, View, Container, Content, } from 'native-base';
import { connect } from 'react-redux'
import { getClearState } from '../../actions/topNewsAction'
import { fetchTopNewsByCountryWithCategory } from '../../api/countriesApi'
import { FlatList, RefreshControl } from 'react-native'
import Categories from '../../assets/Categories'
import SearchBar from '../../components/searchBar';
import TopHeader from '../../components/topHeader';
import NewsCard from '../../components/newsCard'
import FlatListComponent from '../../components/flatlist';

export class NewsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            loading: false,
            pageSize: 20,
            category: "general"

        }
    }
    componentDidMount = () => {
        this._loadCountryWithCategory()
    }

    _loadCountryWithCategory = () => {
        this.props.dispatch(fetchTopNewsByCountryWithCategory(this.props.navigation.getParam("country").Code, this.state.category, this.state.page, this.state.pageSize))
    }

    _moreData = () => {
        this.setState({
            page: this.state.page + 1
        }, () => { this._loadCountryWithCategory() })
    }
    spinnerLoading = () => {
        return <Spinner size="large" />
    }

    _clearData = () => {
        this.props.dispatch(getClearState())
    }

    _categoryList = () => {
        return <FlatList
            data={Categories}
            renderItem={({ item, index }) => {
                return (<Text
                    onPress={() => { this._countryWithCategory(item.Name) }}
                    style={{ height: 30, backgroundColor: "blue", color: "white", borderRadius: 20, marginHorizontal: 10, paddingHorizontal: 10, paddingVertical: 5, justifyContent: "center" }}
                >
                    {item.Name}
                </Text>)
            }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={{ height: 60, paddingVertical: 10, boederWidth: 1, borderColor: "black" }}
        />
    }

    _countryWithCategory = (categotyText) => {
        this.setState({
            category: categotyText,
            page: 1
        }, () => { this._clearData(), this._loadCountryWithCategory() })
    }


    render() {
        const { topNews, refreshing } = this.props.topNews
        let headingTitle = (this.props.navigation.getParam("country")) && this.props.navigation.getParam("country")
        return (
            <Container>
                <Content>
                <TopHeader
                    title={headingTitle.Name.toUpperCase()}
                    leftIconName={"chevron-left"}
                    onLeftClick={() => { this.props.navigation.goBack(null); this._clearData() }}
                />
                {this._categoryList()}
             
                {refreshing ? 
                    <Spinner />
                    :
                    <FlatListComponent
                        rootData={topNews}
                        renderItem={({ item }) => <NewsCard article={item} onClick={() => { this.props.navigation.navigate("NewsContent", { data: item }) }} />}

                        showsHorizontalScrollIndicator={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.refreshing}
                                onRefresh={this.spinnerLoading()}
                            />
                        }
                        keyExtractor={(item, index) => index.toString()}
                        ending={() => { this._moreData() }}
                        onEndReachedThreshold={0}
                        style={{ borderWidth: 1, marginBottom: 100, borderColor: "black" }}

                    />
                }
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        topNews: state.TopHeadline,
    }
}

export default connect(mapStateToProps)(NewsList)
