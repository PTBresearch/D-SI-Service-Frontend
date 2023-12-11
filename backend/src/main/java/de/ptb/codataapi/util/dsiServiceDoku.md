# D-SI Services Backend APIs

## Client_Service Backend API

This API exposes endpoints to manage client Backend.

**Contact information:**

Physikalisch-Technische Bundesanstalt

https://www.ptb.de

Daniel.Hutzschenreuter@ptb.de

> Version: 1.0.0

Base URL: https://d-si.ptb.de/api/client

## Client Controller

Controller with endpoints to manage Client-Backend.

### POST Request:  /api/client/addParticipant

Add a paricipant to participant list

Request URL: https://d-si.ptb.de/api/client/addParicipant
> Example Body Payload

```json
{
  "name": "Physikalisch-Technische Bundesanstalt (PTB)",
  "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-PTB9608"
}
```

### Payload

| Name | Type | Required    |
|------|------|-------------|
| body | body | Participant |

#### Response Examples

> 201 Response message

```
Participant successful created
```

### Responses

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 201              | OK      | created              |

### POST Request: /api/client/addReport

Place a DKCR report with participant List
Request URL: https://d-si.ptb.de/api/client/addReport

> Example Body Payload

```json
 {
  "pidReport": "CCM-KC1",
  "participantList": [
    {
      "participant": {
        "name": "Physikalisch-Technische",
        "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-PTB9608"
      }
    },
    {
      "participant": {
        "name": "NPL",
        "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-NPL9507"
      }
    },
    {
      "participant": {
        "name": "Kriss",
        "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-KRISS9703"
      }
    }
  ]
}
```

### Payload

| Name | Type | Required |
|------|------|----------|
| body | body | Report   |

#### Response Examples

> 201 Response message

```
Report successful created
```

### Responses

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 201              | OK      | created              |

### GET Request: /api/client/report

Get DKCR report.

Request URL: https://d-si.ptb.de/api/client/report

#### Response Example

> 200 Response

```json
{
  "pidReport": "CCM-KC1",
  "participantList": [
    {
      "name": "Physikalisch-Technische Bundesanstalt (PTB)",
      "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-PTB9608"
    },
    {
      "name": "NPL",
      "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-NPL9507"
    }
  ]
}
```

### Response

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |

### GET Request: /api/client/participants

Get participant list.

Request URL: https://d-si.ptb.de/api/client/participants

#### Response Example

```json
{
  "participantList": [
    {
      "name": "Physikalisch-Technische Bundesanstalt (PTB)",
      "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-PTB9608"
    },
    {
      "name": "NPL",
      "pidDCC": "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-NPL9507"
    }
  ]
}
```

### Response

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |

### DELETE Request /api/client/delete/{id}

Delete a participant by ID.

Request URL: https://d-si.ptb.de/api/client/delete/{id}

### Params

| Name | Location | Type | Required | Description            |
|------|----------|------|----------|------------------------|
| id   | path     | long | true     | participant identifier |

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/client/delete/2

#### Response Example

> 200 Response
> ```
> participant deleted
> ```

### Response

| HTTP Status Code | Meaning | Description          | Data schema |
|------------------|---------|----------------------|-------------|
| 200              | OK      | successful operation | string      |

### DELETE Request: /api/client/deleteAll

Delete all participants.

Request URL: https://d-si.ptb.de/api/client/deleteAll

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/client/deleteAll

#### Response Example

> 200 Response
> ```
> participant list deleted
> ```

### Response

| HTTP Status Code | Meaning | Description          | Data schema |
|------------------|---------|----------------------|-------------|
| 200              | OK      | successful operation | string      |

### GET Request /api/client/download

Request URL: https://d-si.ptb.de/api/download

##### Responses

| Code | Description |
|------|-------------|
| 200  | OK          |


------
## D-Constant_Service Backend API

This API exposes endpoints to manage D-Constant Backend.

**Contact information:**

Physikalisch-Technische Bundesanstalt

https://www.ptb.de

Daniel.Hutzschenreuter@ptb.de

> v1.0.0

Base URL: https://d-si.ptb.de/api/d-constant/

## D-Constant Controller
Controller with endpoints to manage D-Constant-Backend.

## GET Request: d-siConstantJson

Get a list of physical and mathematical constants with data (value,unit, dateTime,uncertainty....).

Request URL: https://d-si.ptb.de/api/d-siConstantJson

#### Response Example

> 200 Response

```json
[
  {
    "id": 1,
    "year": "2018",
    "label": "planckConstant",
    "quantityTypeQUDT": "Action",
    "value": "6.62607015E-34",
    "unit": "\\joule\\hertz\\tothe{-1}",
    "dateTime": "2018-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 2,
    "year": "2014",
    "label": "planckConstant",
    "quantityTypeQUDT": "Action",
    "value": "6.626070040E-34",
    "unit": "\\joule\\second",
    "dateTime": "2015-06-25T00:00:00Z",
    "uncertainty": "0.000000081E-34",
    "distribution": "normal"
  },
  {
    "id": 3,
    "year": "2018",
    "label": "speedOfLightInVacuum",
    "quantityTypeQUDT": "Speed",
    "value": "299792458.0",
    "unit": "\\metre\\second\\tothe{-1}",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 4,
    "year": "2014",
    "label": "speedOfLightInVacuum",
    "quantityTypeQUDT": "Speed",
    "value": "299792458.0",
    "unit": "\\metre\\second\\tothe{-1}",
    "dateTime": "2015-06-25T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 5,
    "year": "2018",
    "label": "hyperfineTransitionFrequencyOfCs133",
    "quantityTypeQUDT": "Frequency",
    "value": "9192631770.0",
    "unit": "\\hertz",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 6,
    "year": "2006",
    "label": "hyperfineTransitionFrequencyOfCs133",
    "quantityTypeQUDT": "Frequency",
    "value": "9192631770.0",
    "unit": "\\hertz",
    "dateTime": "2006-03-01T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 7,
    "year": "2018",
    "label": "elementaryCharge",
    "quantityTypeQUDT": "ElectricCharge",
    "value": "1.602176634E-19",
    "unit": "\\coulomb",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 8,
    "year": "2014",
    "label": "elementaryCharge",
    "quantityTypeQUDT": "ElectricCharge",
    "value": "1.6021766208E-19",
    "unit": "\\coulomb",
    "dateTime": "2014-05-20T00:00:00Z",
    "uncertainty": "0.0000000098e-19",
    "distribution": "normal"
  },
  {
    "id": 9,
    "year": "2018",
    "label": "boltzmannConstant",
    "quantityTypeQUDT": "HeatCapacity",
    "value": "1.380649E-23",
    "unit": "\\joule\\kelvin\\tothe{-1}",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 10,
    "year": "2014",
    "label": "boltzmannConstant",
    "quantityTypeQUDT": "HeatCapacity",
    "value": "1.38064852E-23",
    "unit": "\\joule\\kelvin\\tothe{-1}",
    "dateTime": "2015-05-20T00:00:00Z",
    "uncertainty": "7.9E-30",
    "distribution": "normal"
  },
  {
    "id": 11,
    "year": "2018",
    "label": "avogadroConstant",
    "quantityTypeQUDT": "InverseAmountOfSubstance",
    "value": "6.02214076E23",
    "unit": "\\mole\\tothe{-1}",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 12,
    "year": "2014",
    "label": "avogadroConstant",
    "quantityTypeQUDT": "InverseAmountOfSubstance",
    "value": "6.022140857E23",
    "unit": "\\mole\\tothe{-1}",
    "dateTime": "2015-06-25T00:00:00Z",
    "uncertainty": "0.000000074E23",
    "distribution": "normal"
  },
  {
    "id": 13,
    "year": "2018",
    "label": "luminousEfficacy",
    "quantityTypeQUDT": "LuminousFluxPerPower (non QUDT)",
    "value": "683.0",
    "unit": "\\lumen\\watt\\tothe{-1}",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.0",
    "distribution": "normal"
  },
  {
    "id": 14,
    "year": "2018",
    "label": "protonElectronMassRatio",
    "quantityTypeQUDT": "proton-electron mass ratio",
    "value": "1836.15267343",
    "unit": "\\kilogram\\kilogram\\tothe{-1}",
    "dateTime": "2019-05-20T00:00:00Z",
    "uncertainty": "0.00000011",
    "distribution": "normal"
  },
  {
    "id": 15,
    "year": "2014",
    "label": "protonElectronMassRatio",
    "quantityTypeQUDT": "proton-electron mass ratio",
    "value": "1836.15267389",
    "unit": "\\kilogram\\kilogram\\tothe{-1}",
    "dateTime": "2015-06-25T00:00:00Z",
    "uncertainty": "0.00000017",
    "distribution": "normal"
  },
  {
    "id": 16,
    "year": "Digits8",
    "label": "pi",
    "quantityTypeQUDT": "DimensionlessRatio",
    "value": "3.14159265",
    "unit": "\\metre\\metre\\tothe{-1}",
    "dateTime": "2023-06-12T00:00:00Z",
    "uncertainty": "2.9E-9",
    "distribution": "rectangular"
  },
  {
    "id": 17,
    "year": "Digits16",
    "label": "pi",
    "quantityTypeQUDT": "DimensionlessRatio",
    "value": "3.141592653589793",
    "unit": "\\metre\\metre\\tothe{-1}",
    "dateTime": "2023-06-12T00:00:00Z",
    "uncertainty": "2.9E-17",
    "distribution": "rectangular"
  },
  {
    "id": 18,
    "year": "Digits32",
    "label": "pi",
    "quantityTypeQUDT": "DimensionlessRatio",
    "value": "3.14159265358979323846264338327950",
    "unit": "\\metre\\metre\\tothe{-1}",
    "dateTime": "2023-06-12T00:00:00Z",
    "uncertainty": "2.9E-33",
    "distribution": "rectangular"
  },
  {
    "id": 19,
    "year": "Digits8",
    "label": "e",
    "quantityTypeQUDT": "Dimensionless",
    "value": "2.71828183",
    "unit": "\\one",
    "dateTime": "2023-06-12T00:00:00Z",
    "uncertainty": "2.9E-9",
    "distribution": "rectangular"
  },
  {
    "id": 20,
    "year": "Digits16",
    "label": "e",
    "quantityTypeQUDT": "Dimensionless",
    "value": "2.7182818284590452",
    "unit": "\\one",
    "dateTime": "2023-06-12T00:00:00Z",
    "uncertainty": "2.9E-17",
    "distribution": "rectangular"
  },
  {
    "id": 21,
    "year": "Digits32",
    "label": "e",
    "quantityTypeQUDT": "Dimensionless",
    "value": "2.71828182845904523536028747135266",
    "unit": "\\one",
    "dateTime": "2023-06-12T00:00:00Z",
    "uncertainty": "2.9E-33",
    "distribution": "rectangular"
  }
]
```

### Response

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |

## GET Request: getConstantByNameSubName

returns XML_Constant by a specific constant name and subname.

Request URL: https://d-si.ptb.de/api/d-constant/{nameSubname}"

### Params

| Name        | Location | Type   | Required | Description               |
|-------------|----------|--------|----------|---------------------------|
| nameSubname | path     | string | true     | constant name and subname |

#### Request Example:

> Request URL: https://d-si.ptb.de/api/d-constant/planckConstant2018

#### Response Example:

```xml

<dsi:planckConstant2018 xmlns:si="https://ptb.de/si" xmlns:dcterms="https://purl.org/dc/terms/"
                        xmlns:dsi="https://ptb.de/si/d-constant" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                        isSIDefining="true" isCOData="true" isMath="false"
                        xsi:schemaLocation="https://ptb.de/si/d-constant constantDataType.xsd">
    <dsi:identifiers>
        <dsi:identifier>
            <dcterms:publisher>DSI</dcterms:publisher>
            <dcterms:identifier>https://ptb.de/si/d-constant/planckConstant2018</dcterms:identifier>
        </dsi:identifier>
        <dsi:identifier>
            <dcterms:publisher>DSI</dcterms:publisher>
            <dcterms:identifier>https://ptb.de/si/d-constant/codata/planckConstant</dcterms:identifier>
        </dsi:identifier>
        <dsi:identifier>
            <dcterms:publisher>BIPM</dcterms:publisher>
            <dcterms:identifier>https://siunits.stuchalk.domains.unf.edu/si/definingconstant/planck_constant
            </dcterms:identifier>
        </dsi:identifier>
        <dsi:identifier>
            <dcterms:publisher>CODATA</dcterms:publisher>
            <dcterms:identifier>https://siunits.stuchalk.domains.unf.edu/si/definingconstant/planck_constant
            </dcterms:identifier>
        </dsi:identifier>
    </dsi:identifiers>
    <dsi:dsiApproved>true</dsi:dsiApproved>
    <si:constant>
        <si:label>planckConstant</si:label>
        <si:quantityTypeQUDT>Action</si:quantityTypeQUDT>
        <si:value>6.62607015E-34</si:value>
        <si:unit>\joule\hertz\tothe{-1}</si:unit>
        <si:dateTime>2018-05-20T00:00:00Z</si:dateTime>
        <si:uncertainty>0.0</si:uncertainty>
        <si:distribution>normal</si:distribution>
    </si:constant>
</dsi:planckConstant2018>
```

### Response

| HTTP Status Code | Meaning | Description                         | Data schema |
|------------------|---------|-------------------------------------|-------------|
| 200              | OK      | OK                                  | string      |
| 404 /  500?      | ERROR   | the specified constant pid is wrong | string      |

> 200 Response

> 404 Response

------------
# DKCR_Service  Backend API
This API exposes endpoints to manage DKCR-Backend.

> Version: 1.0.0

Base URL: https://d-si.ptb.de/api/d-comparison

**Contact information:**  
Physikalisch-Technische Bundesanstalt
https://www.ptb.de
Daniel.Hutzschenreuter@ptb.de
## D-Comparison Controller
Controller with endpoints to manage Client-Backend.

### POST Request: evaluateComparison
reads the mass values from the DCC's specified in the participant list and calculates energy values, KC values and Grubstest values from them.

Request URL: https://d-si.ptb.de/api/d-comparison/evaluateComparison

> Example Body  Payload

```json
{"keyComparisonData": 
             {
            "pidReport" : "NMIJ_All",
            "participantList" :
            [
                       { "participant" : 
                           { "name" : "BIPM", 
						     "pidDCC" : "CCM.M-K1-BIPM9502" 
						   } 
                       }, 
                       { "participant" :
                            { "name" : "Physikalisch-Technische Bundesanstalt",
							  "pidDCC" : "CCM.M-K1-PTB9608"
							} 
                        },
                        {
                            "participant" :
                            {"name": "KRISS", 
							 "pidDCC": "CCM.M-K1-KRISS9703"
							}
                        },
                        {
                            "participant" :
                            {"name": "NPL", 
							 "pidDCC": "CCM.M-K1-NPL9507"
							}
                        }
                    ] 
                } 
            }
```
#### Response Examples

> 200 Response message

```
 successful operation
```
### Responses

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |


------------# DCC_Service Backend Api

This API exposes endpoints to manage DCC_Service Backend.

**Contact information:**

Physikalisch-Technische Bundesanstalt

https://www.ptb.de

Daniel.Hutzschenreuter@ptb.de

> version 1.0.0

Base URL: https://d-si.ptb.de/api/d-dcc

## DCC_Controller:

DCC Controller with endpoints: /api/d-dcc

## POST Request: addDcc

Add a new DCC to the Database.

Request URL: https://d-si.ptb.de/api/d-dcc/addDcc

> Example Body Payload

```json
{
  "pid": "CCM.M-K1-NPL9507",
  "xmlBase64": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGRjYzpkaWdpdGFsQ2FsaWJyYXRpb25DZXJ0aWZpY2F0ZSB4bWx",
  "isDccValid": true
}
```

### Payload

| Name | Type | Required |
|------|------|----------|
| body | body | Dcc      |

#### Response Examples

> 201 Response message

```
  "Dcc successful created"
```

> 400 Response message

```
"pid already exist"
```

### Responses

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 201              | OK      | created              |
| 400              | ERROR   | bad request/conflict |

## GET Request: getPidList

Get available pidList of DCC stored in the database.

Request URL: https://d-si.ptb.de/api/d-dcc/dccPidList

#### Response Example

> 200 Response

```json
[
  "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-KRISS9703",
  "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-NPL9507",
  "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-PTB9608",
  "https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-BIPM9502"
]
```

### Response

| HTTP Status Code | Meaning | Description          |
|------------------|---------|----------------------|
| 200              | OK      | successful operation |

## GET Request: isDccValid

Checks if DCC by pid is valid.

Request URL: https://d-si.ptb.de/api/d-dcc/dccValidation/{pid}

### Params

| Name | Location | Type   | Required | Description           |
|------|----------|--------|----------|-----------------------|
| pid  | path     | string | true     | persistent identifier |

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/d-dcc/dccValidation/CCM.M-K1-NPL9507

#### Response Example

> 200 Response
> ```json
> true
> ```

> 404 Response
>```string
>Not Found 
>```

### Response

| HTTP Status Code | Meaning | Description | Data schema |
|------------------|---------|-------------|-------------|
| 200              | OK      | OK          | boolean     |
| 404              | ERROR   | Not Found   | string      |

## GET Request: getDccByPid

returns XML_Dcc encoded as StringBase64 by a specific pid.

Request URL: https://d-si.ptb.de/api/d-dcc/dcc/{pid}

### Params

| Name | Location | Type   | Required | Description           |
|------|----------|--------|----------|-----------------------|
| pid  | path     | string | true     | persistent identifier |

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-NPL9507

#### Response Example:

```json
"PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGRjYzpkaWdpdGFsQ2FsaWJyYXRpb25DZXJ0aWZpY2F0ZSB4bWx"
```

### Response

| HTTP Status Code | Meaning | Description | Data schema |
|------------------|---------|-------------|-------------|
| 200              | OK      | OK          | string      |
| 404              | ERROR   | Not Found   | string      |

> 200 Response

> 404 Response

## GET Request: geDccContentByRefType

Return DCC_XML with searched refType attribute by a specific DccPid .

GET /api/d-dcc/dcc/{pid}/{refType}

### Params

| Name    | Location | Type   | Required | Description           |
|---------|----------|--------|----------|-----------------------|
| pid     | path     | string | yes      | persistent identifier |
| refType | path     | string | yes      | reference type        |

#### Request Example:

> Request URL:
https://d-si.ptb.de/api/d-dcc/dcc/CCM.M-K1-NPL9507/mass_mass

> Response Example

```xml

<dcc:result refType="mass_mass">
    <dcc:name>
        <dcc:content lang="en">Result: weighted mean value</dcc:content>
    </dcc:name>
    <dcc:data>
        <dcc:quantity refType="basic_nominalValue">
            <dcc:name>
                <dcc:content lang="en">nominal value</dcc:content>
            </dcc:name>
            <si:real>
                <si:value>1</si:value>
                <si:unit>\kilogram</si:unit>
            </si:real>
        </dcc:quantity>
        <dcc:quantity refType="basic_measuredValue">
            <dcc:name>
                <dcc:content lang="en">mass</dcc:content>
            </dcc:name>
            <si:real>
                <si:value>1.000478</si:value>
                <si:unit>\kilogram</si:unit>
                <si:expandedUnc>
                    <si:uncertainty>0.000032</si:uncertainty>
                    <si:coverageFactor>2</si:coverageFactor>
                    <si:coverageProbability>0.95</si:coverageProbability>
                </si:expandedUnc>
            </si:real>
        </dcc:quantity>
    </dcc:data>
</dcc:result>
```

> 200 Response

### Response

| HTTP Status Code | Meaning | Description | Data schema |
|------------------|---------|-------------|-------------|
| 200              | OK      | OK          | xml         |

# DCC Data Schema

```json
{
  "pid": "string",
  "xmlBase64": "string",
  "isDccValid": "boolean"
}

```

### Attribute

| Name       | Type    | Required | Restrictions | Title | Description                       |
|------------|---------|----------|--------------|-------|-----------------------------------|
| pid        | string  | true     | none         | none  | persistent identifier             |
| xmlBase64  | string  | true     | none         | none  | Xml_Dcc converted to StringBase64 |
| isDccValid | boolean | true     | none         | none  | valid or invalid DCC              |





