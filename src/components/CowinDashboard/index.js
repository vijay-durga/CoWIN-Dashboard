import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.fetchedDetails()
  }

  fetchedDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(vaccinationDataApiUrl)
    // console.log(response)
    if (response.ok === true) {
      const result = await response.json()
      // console.log(result)
      const updatingData = {
        lastSevenDaysVaccination: result.last_7_days_vaccination.map(
          eachDay => ({
            vaccineDate: eachDay.vaccine_date,
            dose1: eachDay.dose_1,
            dose2: eachDay.dose_2,
          }),
        ),

        vaccinationByAge: result.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),

        vaccinationByGender: result.vaccination_by_gender.map(eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        })),
      }
      this.setState({
        vaccinationData: updatingData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  vaccinationFailure = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  vaccinationSuccess = () => {
    const {vaccinationData} = this.state
    // console.log(vaccinationData)
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.lastSevenDaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGender={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge vaccinationByAge={vaccinationData.vaccinationByAge} />
      </>
    )
  }

  vaccinationInProgress = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  dependOnAppStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.vaccinationSuccess()
      case apiStatusConstants.failure:
        return this.vaccinationFailure()
      case apiStatusConstants.inProgress:
        return this.vaccinationInProgress()
      default:
        return null
    }
  }

  render() {
    // const {apiStatus, vaccinationData} = this.state
    // console.log(apiStatus)
    // console.log(vaccinationData)
    return (
      <div className="background-container">
        <div className="img-title-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="para-title">Co-WIN</p>
        </div>
        <div>
          <h1 className="main-heading">CoWIN Vaccination in India</h1>
        </div>
        <div>{this.dependOnAppStatus()}</div>
      </div>
    )
  }
}

export default CowinDashboard
