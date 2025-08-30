"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Clock, Search, Navigation, Heart, Stethoscope, Truck, Building2, Star } from "lucide-react"

const healthcareCenters = [
  {
    id: 1,
    name: "Apollo Hospitals",
    type: "Hospital",
    address: "21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006",
    phone: "+91 44 2829 3333",
    hours: "24/7 Emergency Services",
    distance: "2.3 km",
    rating: 4.5,
    services: ["Emergency Care", "Cardiology", "Oncology", "ICU"],
    emergency: true,
  },
  {
    id: 2,
    name: "Fortis Malar Hospital",
    type: "Hospital",
    address: "52, 1st Main Rd, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020",
    phone: "+91 44 4289 2222",
    hours: "24/7 Emergency Services",
    distance: "3.1 km",
    rating: 4.3,
    services: ["Emergency Care", "Surgery", "Maternity", "Pediatrics"],
    emergency: true,
  },
  {
    id: 3,
    name: "Primary Health Centre",
    type: "Primary Care",
    address: "Gandhi Nagar Main Road, Adyar, Chennai, Tamil Nadu 600020",
    phone: "+91 44 2441 5678",
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
    distance: "1.8 km",
    rating: 4.1,
    services: ["General Medicine", "Pediatrics", "Vaccinations", "Basic Checkups"],
    emergency: false,
  },
  {
    id: 4,
    name: "MIOT International",
    type: "Specialty Clinic",
    address: "4/112, Mount Poonamallee Rd, Manapakkam, Chennai, Tamil Nadu 600089",
    phone: "+91 44 2249 2288",
    hours: "Mon-Sat: 9AM-7PM",
    distance: "8.5 km",
    rating: 4.6,
    services: ["Orthopedics", "Neurology", "Cardiology", "Transplant"],
    emergency: false,
  },
  {
    id: 5,
    name: "Government General Hospital",
    type: "Hospital",
    address: "EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003",
    phone: "+91 44 2819 2231",
    hours: "24/7 Emergency Services",
    distance: "5.2 km",
    rating: 3.8,
    services: ["Emergency Care", "General Medicine", "Surgery", "Outpatient"],
    emergency: true,
  },
  {
    id: 6,
    name: "Mobile Health Unit - Adyar",
    type: "Mobile Clinic",
    address: "Various locations in Adyar area (see schedule)",
    phone: "+91 44 2445 9876",
    hours: "Schedule varies by location",
    distance: "0.5 km",
    rating: 4.2,
    services: ["Basic Checkups", "Vaccinations", "Health Screenings", "Maternal Care"],
    emergency: false,
  },
  {
    id: 7,
    name: "Sankara Nethralaya",
    type: "Specialty Clinic",
    address: "18, College Rd, Nungambakkam, Chennai, Tamil Nadu 600006",
    phone: "+91 44 2827 1616",
    hours: "Mon-Sat: 8AM-6PM",
    distance: "4.7 km",
    rating: 4.7,
    services: ["Eye Care", "Retinal Surgery", "Corneal Transplant", "Pediatric Ophthalmology"],
    emergency: false,
  },
  {
    id: 8,
    name: "Voluntary Health Services",
    type: "Hospital",
    address: "Taramani Link Rd, Velachery, Chennai, Tamil Nadu 600042",
    phone: "+91 44 3914 4000",
    hours: "24/7 Emergency Services",
    distance: "6.8 km",
    rating: 4.4,
    services: ["Emergency Care", "Maternity", "Pediatrics", "General Surgery"],
    emergency: true,
  },
]

const serviceTypes = [
  "All",
  "Primary Care",
  "Hospital",
  "Specialty Clinic",
  "Mobile Clinic",
  "Urgent Care",
  "Specialized Care",
]

export default function HealthcareInfoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false)

  const filteredCenters = healthcareCenters.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "All" || center.type === selectedType
    const matchesEmergency = !showEmergencyOnly || center.emergency

    return matchesSearch && matchesType && matchesEmergency
  })

  const getTypeIcon = (type: string) => {
    const icons = {
      "Primary Care": Stethoscope,
      Hospital: Building2,
      "Specialty Clinic": Heart,
      "Mobile Clinic": Truck,
      "Urgent Care": Clock,
      "Specialized Care": Star,
    }
    return icons[type as keyof typeof icons] || MapPin
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "Primary Care": "bg-blue-100 text-blue-800",
      Hospital: "bg-red-100 text-red-800",
      "Specialty Clinic": "bg-green-100 text-green-800",
      "Mobile Clinic": "bg-purple-100 text-purple-800",
      "Urgent Care": "bg-yellow-100 text-yellow-800",
      "Specialized Care": "bg-indigo-100 text-indigo-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Healthcare Centers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find nearby healthcare facilities, contact information, and services in your area
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="text-sm"
                >
                  {type}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant={showEmergencyOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                className="flex items-center space-x-2"
              >
                <Truck className="h-4 w-4" />
                <span>Emergency Only</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Healthcare Centers Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {filteredCenters.map((center, index) => {
            const TypeIcon = getTypeIcon(center.type)

            return (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="h-full card-hover accent-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{center.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getTypeColor(center.type)}>{center.type}</Badge>
                              {center.emergency && (
                                <Badge variant="destructive" className="text-xs">
                                  24/7 Emergency
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{center.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Navigation className="h-3 w-3" />
                          <span>{center.distance}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{center.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{center.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{center.hours}</span>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {center.services.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Navigation className="mr-2 h-4 w-4" />
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCenters.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No healthcare centers found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </motion.div>
        )}

        {/* Emergency Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Truck className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-800">Emergency Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Emergency Services</h4>
                  <p className="text-2xl font-bold text-red-600">108</p>
                  <p className="text-sm text-red-700">Life-threatening emergencies</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Contact Emergency</h4>
                  <p className="text-2xl font-bold text-red-600">102</p>
                  <p className="text-sm text-red-700">24/7 emergency contact</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Mental Health Crisis</h4>
                  <p className="text-2xl font-bold text-red-600">+91-9820466726</p>
                  <p className="text-sm text-red-700">Crisis helpline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="text-center accent-card">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Location-Based</h3>
              <p className="text-sm text-gray-600">
                Find healthcare facilities near you with accurate distance and contact information
              </p>
            </CardContent>
          </Card>

          <Card className="text-center accent-card">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-Time Info</h3>
              <p className="text-sm text-gray-600">
                Up-to-date hours, services, and availability information for better planning
              </p>
            </CardContent>
          </Card>

          <Card className="text-center accent-card">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Emergency Ready</h3>
              <p className="text-sm text-gray-600">
                Quick access to emergency services and critical health information when needed
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
