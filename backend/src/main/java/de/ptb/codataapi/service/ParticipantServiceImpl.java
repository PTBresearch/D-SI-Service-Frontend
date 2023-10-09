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


import de.ptb.codataapi.model.Participant;
import de.ptb.codataapi.model.Report;
import de.ptb.codataapi.repository.ParticipantRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Class for participant service implements ParticipantService.
 * @author Wafa El jaoua
 */
@Service
@AllArgsConstructor
@Slf4j
public class ParticipantServiceImpl implements ParticipantService{
    ParticipantRepository participantRepository;

    @Override
    public List<Participant> getParticipantList() {

        return participantRepository.getAllParticipants() ;
    }

    @Override
    public boolean delete(long id) {
        var isRemoved = participantRepository.delete(id);
        return  isRemoved;
    }

    @Override
    public void deleteAll() {
        participantRepository.deleteAll();
    }

    @Override
    public Participant addParticipant(Participant participant) {
        return  participantRepository.addParticipant(participant);
    }

    @Override
    public Participant update(Participant participant) {
        return participantRepository.update(participant);
    }

    @Override
    public Report addReport(Report report) {
        return participantRepository.addReport(report);
    }

    @Override
    public Report getReport() {
        return participantRepository.getReport();
    }

}