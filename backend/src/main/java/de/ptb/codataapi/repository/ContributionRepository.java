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

package de.ptb.codataapi.repository;


import de.ptb.codataapi.model.Contribution;
import de.ptb.codataapi.model.Report;
import lombok.Data;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
@Repository
@Data
public class ContributionRepository {
    public List<Contribution> contributionList = new ArrayList<Contribution>();
    Report reportNew;
    public List<Report> reportList = new ArrayList<Report>();
    public Report report = new Report();

    public List<Contribution> getAllContributions() {
        return contributionList;
    }

    public Report getReport() {
        return report;
    }

    public List<Report> getAllReports() {
        return reportList;
    }

    public boolean delete(Long id) {
        var isRemoved = contributionList.removeIf(x -> x.getId().equals(id));
        return isRemoved;
    }
    public void deleteAll() {
        contributionList.removeAll(contributionList);
    }
    public Contribution update(Contribution p) {
        int idx = 0;
        int id = 0;
        for (int i = 0; i < contributionList.size(); i++) {
            if (contributionList.get(i).getId() == (p.getId())) {
                id = Math.toIntExact(p.getId());
                idx = i;
                break;
            }
        }
        Contribution contribution = new Contribution();
        contribution.setId(p.getId());
        contribution.setParticipantName(p.getParticipantName());
        contribution.setContributionName(p.getContributionName());
        contribution.setPidDCC(p.getPidDCC());
        contributionList.add(contribution);
        return contribution;
    }

    public Contribution addContribution(Contribution c) {
        Contribution contribution = new Contribution();
        contribution.setId(c.getId());
        contribution.setParticipantName(c.getParticipantName());
        contribution.setContributionName(c.getContributionName());
        contribution.setPidDCC(c.getPidDCC());
        contributionList.add(contribution);
        contribution.setProperty(c.getProperty());
        return contribution;
    }

    public Report addReport(Report r) {
        report.setPidReport(r.getPidReport());
        report.setSmartStandardEvaluationMethod(r.getSmartStandardEvaluationMethod());
        report.setContributionList(r.getContributionList());
        report.setPilotParticipantName(r.getPilotParticipantName());
        return report;
    }


}
