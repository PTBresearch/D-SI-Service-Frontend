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
 * LAST MODIFIED:		 06.10.23, 21:49
 */

package de.ptb.codataapi.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.ptb.codataapi.model.Contribution;
import de.ptb.codataapi.model.Report;
import de.ptb.codataapi.repository.ContributionRepository;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.xml.bind.DatatypeConverter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * Class for participant service implements ContributionsService.
 * @author Wafa El jaoua
 */
@Service
@Slf4j
public class ContributionsServiceImpl implements ContributionsService {


    @Autowired
    ContributionRepository contributionRepository;

    @Override
    public List<Contribution> getContributionList(String sessionId) {

        return contributionRepository.getAllContributions(sessionId) ;
    }

    @Override
    public boolean delete(String sessionId,long id ){
        var isRemoved = contributionRepository.delete(sessionId,id);
        return  isRemoved;
    }

    @Override
    public void deleteAll(String sessionId) {
        contributionRepository.deleteAll(sessionId);
    }

    @Override
    public Contribution addContribution(String sessionId,Contribution contribution) {
        return  contributionRepository.addContribution(sessionId,contribution);
    }

//    @Override
//    public Contribution update(Contribution participant) {
//        return participantRepository.update(participant);
//    }

    @Override
    public Report addReport(String sessionId,Report report) {
        return contributionRepository.addReport(sessionId, report);
    }

    @Override
    public Report getReport(String sessionId) {
        return contributionRepository.getReport(sessionId);
    }
    @Override
    public void downloadAndSaveReport(String sessionId,HttpServletResponse response)throws IOException{

    RestTemplate restTemplate = new RestTemplate();
//        String url = "https://d-si.ptb.de/api/d-comparison/evaluateComparison";
    String url = "http://localhost:8083/api/d-comparison/evaluateComparison";
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
    ObjectNode rootNode = objectMapper.createObjectNode();
    String url1 = "http://localhost:8084/api/client/report";
    RestTemplate restTemplate1 = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("sessionId", sessionId);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);

        ResponseEntity<Report> reportResponse = restTemplate1.exchange(
                url1,
                HttpMethod.GET,
                httpEntity,
                Report.class
        );
        Report report = reportResponse.getBody();
        // Contributions aus dem Repository laden
        List<Contribution> contributions = contributionRepository.getAllContributions(sessionId);
        report.setContributionList(contributions);
// Aktualisierten Report speichern
        addReport(sessionId, report);

        System.out.println("reportNeu: " + report.toString());


  //  Report report = restTemplate1.getForObject(url1, Report.class, 200);
    //    Report report = getReport(sessionId);
    addReport( sessionId, report);
    System.out.println("report: " + report.toString());
    // Retrieve the "reportJsonData" JsonNode
    String reportJson = objectMapper.writeValueAsString(report);
    JsonNode KeyCompJsonNode = objectMapper.readTree(reportJson);
    ObjectNode keyComparisonDataObjectNode = objectMapper.createObjectNode();
    keyComparisonDataObjectNode.set("pidReport", KeyCompJsonNode.get("pidReport"));
    keyComparisonDataObjectNode.set("smartStandardEvaluationMethod", KeyCompJsonNode.get("smartStandardEvaluationMethod"));
    JsonNode contributionListNode = KeyCompJsonNode.get("contributionList");
    keyComparisonDataObjectNode.putArray("contributionList");
    keyComparisonDataObjectNode.set("pilotParticipantName", KeyCompJsonNode.get("pilotParticipantName"));
    for (JsonNode contributionNode : contributionListNode) {
        ObjectNode contributionObjectNode = objectMapper.createObjectNode();
        contributionObjectNode.set("contribution", contributionNode);
        keyComparisonDataObjectNode.withArray("contributionList").add(contributionObjectNode);
    }

        rootNode.set("keyComparisonData", keyComparisonDataObjectNode);
        // Convert the updated JsonNode to a JSON String
        String updatedJsonString = objectMapper.writeValueAsString(rootNode);
        System.out.println("postRequest: " + updatedJsonString);
       // HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<String>(updatedJsonString, headers);
        // POST Request with base64String and reportName as response
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
            System.out.print("Data not written to file.");
            e.printStackTrace();
        }
        //save reportFile
        File reportFile = new File("backend\\src\\main\\resources\\static\\dccFiles\\K1.xml");
        if (reportFile.exists() && !reportFile.isDirectory()) {
            response.setContentType("application/octet-stream");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            String headerKey = "Content-Disposition";
            String reportFileName = String.valueOf(reportName);
            String fileName = reportFileName.replace("\"", "") +".xml";
            String headerValue = "attachment;filename=" + fileName;
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
