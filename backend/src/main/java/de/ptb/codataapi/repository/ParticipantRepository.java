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


import de.ptb.codataapi.model.Participant;
import de.ptb.codataapi.model.Report;
import lombok.Data;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
@Repository
@Data
public class ParticipantRepository {
    public List<Participant> participantList = new ArrayList<Participant>();
    Report reportNew;
    public List<Report> reportList = new ArrayList<Report>();
    public Report report = new Report();

    public List<Participant> getAllParticipants() {
        return participantList;
    }

    public Report getReport() {
        return report;
    }

    public List<Report> getAllReports() {
        return reportList;
    }

    public boolean delete(Long id) {
        var isRemoved = participantList.removeIf(x -> x.getId().equals(id));
        return isRemoved;
    }
    public void deleteAll() {
        participantList.removeAll(participantList);
    }
    public Participant update(Participant p) {
        int idx = 0;
        int id = 0;
        for (int i = 0; i < participantList.size(); i++) {
            if (participantList.get(i).getId() == (p.getId())) {
                id = Math.toIntExact(p.getId());
                idx = i;
                break;
            }
        }
        Participant participant = new Participant();
        participant.setId(p.getId());
        participant.setName(p.getName());
        participant.setPidDCC(p.getPidDCC());
        participantList.add(participant);
        return participant;
    }

    public Participant addParticipant(Participant p) {
        Participant participant = new Participant();
        participant.setId(p.getId());
        participant.setName(p.getName());
        participant.setPidDCC(p.getPidDCC());
        participantList.add(participant);
        return participant;
    }

    public Report addReport(Report r) {
        report.setPidReport(r.getPidReport());
        report.setParticipantList(r.getParticipantList());
        return report;
    }


}
