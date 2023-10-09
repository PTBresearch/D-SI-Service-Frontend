/*
 * Copyright (c) 2022-2023  Physikalisch-Technische Bundesanstalt (PTB), all rights reserved.
 * This source code and software is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 * The software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this Code.  If not, see http://www.gnu.org/licenses.
 * CONTACT: 		info@ptb.de
 * DEVELOPMENT:		https://d-si.ptb.de
 * AUTHORS:		Wafa El Jaoua, Tobias Hoffmann, Clifford Brown, Daniel Hutzschenreuter
 * LAST MODIFIED:		 28.09.23, 10:20
 */
package de.ptb.codataapi.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import de.ptb.codataapi.model.*;
import de.ptb.codataapi.service.ParticipantService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.xml.bind.DatatypeConverter;
import lombok.AllArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.*;
import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/api/client")
public class ClientController {

    private ParticipantService participantService;
    private static final String VALID_DCC = "PTB-DCC-4711";

    /**
     * <p>method retrieves a List of participants through an HTTP GET request.</p>
     * @return ResponseEntity, which return a List of participants in JSON format as a response Entity with an HTTP status of 200 (OK).
     */
    @RequestMapping(value = "/participants", method = RequestMethod.GET)
    public ResponseEntity<List<Participant>> getParticipants() {
        return new ResponseEntity<>(participantService.getParticipantList(), HttpStatus.OK);
    }

    /**
     * <p>method creates a new participant through an HTTP POST request.</p>
     * @return ResponseEntity, which return a new participant as a response Entity with an HTTP status of 201 (CREATED).
     */

    @RequestMapping(value = "/addParticipant", method = RequestMethod.POST)
    public ResponseEntity<Participant> addParticipant(@RequestBody Participant participant) {
        return new ResponseEntity<>(participantService.addParticipant(participant), HttpStatus.CREATED);
    }

    /**
     * <p>method deletes a  specific participant through an HTTP DELETE request.</p>
     * @return ResponseEntity, which return  a response Entity with an HTTP status of 200(OK).
     */
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Long> delete(@PathVariable("id") Long id) {
        participantService.delete(Math.toIntExact(id));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <p>method deletes all participants through an HTTP DELETE request.</p>
     * @return ResponseEntity, which return a response Entity with an HTTP status of 200 (OK).
     */
    @DeleteMapping("/deleteAll")
    public ResponseEntity<Long> deleteAll() {
        participantService.deleteAll();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * <p>method retrieves a report through an HTTP GET request.</p>
     * @return ResponseEntity, which return a report with the PidReport and the List of participants in JSON format as a response Entity with an HTTP status of 200 (OK).
     */
    @RequestMapping(value = "/report", method = RequestMethod.GET)
    public ResponseEntity<Report> getReport() {
        Report r = new Report();
        r.setPidReport(participantService.getReport().getPidReport());
        r.setParticipantList(participantService.getParticipantList());
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    /**
     * <p>method creates a new report through an HTTP POST request.</p>
     * @return ResponseEntity, which return a report as a response Entity with an HTTP status of 201 (CREATED).
     */
    @RequestMapping(value = "/addReport", method = RequestMethod.POST)
    public ResponseEntity<Report> addReport(@RequestBody Report report) {
        return new ResponseEntity<>(participantService.addReport(report), HttpStatus.CREATED);
    }

    /**
     * <p>method to download the XML report through an HTTP GET request from the DKCR_Backend API with POST request,
     * which has as  response the filename and Base64String.</p>
     * @author Wafa El jaoua
     */
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public void downloadReportXML(HttpServletResponse response) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://d-si.ptb.de/api/d-comparison/evaluateComparison";
//        String url = "http://localhost:8083/api/d-comparison/evaluateComparison";
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        ObjectNode rootNode = objectMapper.createObjectNode();
        Report r = getReport().getBody();
        addReport(r);
        System.out.println("report: " + r.toString());
        // Retrieve the "reportJsonData" JsonNode
        String reportJson = objectMapper.writeValueAsString(r);
        JsonNode KeyCompJsonNode = objectMapper.readTree(reportJson);
        ObjectNode keyComparisonDataObjectNode = objectMapper.createObjectNode();
        keyComparisonDataObjectNode.put("pidReport", KeyCompJsonNode.get("pidReport"));
        JsonNode participantListNode = KeyCompJsonNode.get("participantList");
        keyComparisonDataObjectNode.putArray("participantList");
        for (JsonNode participantNode : participantListNode) {
            ObjectNode participantObjectNode = objectMapper.createObjectNode();
            participantObjectNode.set("participant", participantNode);
            keyComparisonDataObjectNode.withArray("participantList").add(participantObjectNode);
        }
        rootNode.set("keyComparisonData", keyComparisonDataObjectNode);
        // Convert the updated JsonNode to a JSON String
        String updatedJsonString = objectMapper.writeValueAsString(rootNode);
        System.out.println("postRequest: " + updatedJsonString);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<String>(updatedJsonString, headers);
        //POST Request with base64String and reportName as  response
        ResponseEntity<String> answer = restTemplate.postForEntity(url, entity, String.class);
        JsonNode rootNode1 = objectMapper.readTree(answer.getBody());
        String base64String = String.valueOf(rootNode1.path("base64String"));
        JsonNode reportName = rootNode1.path("fileName");
        String decodedBase64String = new String(DatatypeConverter.parseBase64Binary(base64String));
        File file = new File("backend\\src\\main\\resources\\static\\dccFiles\\K1.xml");
        try (FileOutputStream fos = new FileOutputStream(file);
             BufferedOutputStream bos = new BufferedOutputStream(fos)) {
            //convert string to byte array
            byte[] bytes = decodedBase64String.getBytes();
            //write byte array to file
            bos.write(bytes);
            bos.close();
            fos.close();
            System.out.print("Data written to file successfully.");
        } catch (IOException e) {
            System.out.print("Data not written to file successfully.");
            e.printStackTrace();
        }
        //save reportFile
        File reportFile = new File("backend\\src\\main\\resources\\static\\dccFiles\\K1.xml");
        if (reportFile.exists() && !reportFile.isDirectory()) {
            response.setContentType("application/octet-stream");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            String headerKey = "Content-Disposition";
            String stringWithoutQuotes = String.valueOf(reportName);
            String ds = stringWithoutQuotes.replace("\"", "");
            String headerValue = "attachment;filename=" + ds;
            response.setHeader(headerKey, headerValue);
            ServletOutputStream outputStream = response.getOutputStream();
            BufferedInputStream inputStream = new BufferedInputStream(new FileInputStream(reportFile));
            byte[] buffer = new byte[8192];
            int bytesRead = -1;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            inputStream.close();
            outputStream.close();
        }
    }
}

